import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';
import { Quote } from '../../entities/quote.entity';
import { ScheduleSlot } from '../../entities/schedule-slot.entity';
import { WorkOrderMaterial } from '../../entities/work-order-material.entity';
import { WorkOrder } from '../../entities/work-order.entity';
import {
  AddMaterialDto,
  CreateQuoteDto,
  CreateScheduleDto,
  CreateWorkOrderDto,
  UpdateWorkOrderDto,
} from './dto';

@Injectable()
export class WorkOrdersService {
  constructor(
    @InjectRepository(WorkOrder)
    private readonly workOrderRepository: Repository<WorkOrder>,
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    @InjectRepository(ScheduleSlot)
    private readonly scheduleRepository: Repository<ScheduleSlot>,
    @InjectRepository(WorkOrderMaterial)
    private readonly workOrderMaterialRepository: Repository<WorkOrderMaterial>,
  ) {}

  async create(
    createWorkOrderDto: CreateWorkOrderDto,
    user: RequestUser,
  ): Promise<WorkOrder> {
    const workOrderData: any = {
      ...createWorkOrderDto,
      adminId: user.adminId,
    };

    if (createWorkOrderDto.scheduledStartDate) {
      workOrderData.scheduledStartDate = new Date(
        createWorkOrderDto.scheduledStartDate,
      );
    }
    if (createWorkOrderDto.scheduledCompletionDate) {
      workOrderData.scheduledCompletionDate = new Date(
        createWorkOrderDto.scheduledCompletionDate,
      );
    }

    const workOrder = this.workOrderRepository.create(workOrderData);
    return (await this.workOrderRepository.save(workOrder)) as any;
  }

  async findAll(
    user: RequestUser,
    paginationDto: PaginationDto,
  ): Promise<{
    data: WorkOrder[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.workOrderRepository
      .createQueryBuilder('workOrder')
      .leftJoinAndSelect('workOrder.ticket', 'ticket')
      .leftJoinAndSelect('workOrder.vendor', 'vendor')
      .where('workOrder.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(workOrder.title ILIKE :search OR workOrder.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`workOrder.${sortBy}`, sortOrder)
      .skip(skip)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string, user: RequestUser): Promise<WorkOrder> {
    const workOrder = await this.workOrderRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: [
        'ticket',
        'vendor',
        'quotes',
        'schedules',
        'materials',
        'materials.materialItem',
      ],
    });

    if (!workOrder) {
      throw new NotFoundException(`Work order with ID ${id} not found`);
    }

    return workOrder;
  }

  async update(
    id: string,
    updateWorkOrderDto: UpdateWorkOrderDto,
    user: RequestUser,
  ): Promise<WorkOrder> {
    const workOrder = await this.findOne(id, user);

    const updateData: any = { ...updateWorkOrderDto };
    if (updateWorkOrderDto.scheduledStartDate) {
      updateData.scheduledStartDate = new Date(
        updateWorkOrderDto.scheduledStartDate,
      );
    }
    if (updateWorkOrderDto.scheduledCompletionDate) {
      updateData.scheduledCompletionDate = new Date(
        updateWorkOrderDto.scheduledCompletionDate,
      );
    }

    Object.assign(workOrder, updateData);
    return (await this.workOrderRepository.save(workOrder)) as any;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const workOrder = await this.findOne(id, user);
    await this.workOrderRepository.softDelete(id);
  }

  // Quote management
  async getQuotes(workOrderId: string, user: RequestUser): Promise<Quote[]> {
    const workOrder = await this.findOne(workOrderId, user);
    return await this.quoteRepository.find({
      where: { workOrderId },
      relations: ['vendor'],
      order: { createdAt: 'DESC' },
    });
  }

  async createQuote(
    workOrderId: string,
    createQuoteDto: CreateQuoteDto,
    user: RequestUser,
  ): Promise<Quote> {
    const workOrder = await this.findOne(workOrderId, user);

    const quote = this.quoteRepository.create({
      ...createQuoteDto,
      workOrderId,
      validUntil: new Date(createQuoteDto.validUntil),
    });

    return (await this.quoteRepository.save(quote)) as any;
  }

  // Schedule management
  async createSchedule(
    workOrderId: string,
    createScheduleDto: CreateScheduleDto,
    user: RequestUser,
  ): Promise<ScheduleSlot> {
    const workOrder = await this.findOne(workOrderId, user);

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      workOrderId,
      start: new Date(createScheduleDto.startDate),
      end: new Date(createScheduleDto.endDate),
      startDate: new Date(createScheduleDto.startDate),
      endDate: new Date(createScheduleDto.endDate),
    });

    return (await this.scheduleRepository.save(schedule)) as any;
  }

  // Material management
  async getMaterials(
    workOrderId: string,
    user: RequestUser,
  ): Promise<WorkOrderMaterial[]> {
    const workOrder = await this.findOne(workOrderId, user);
    return await this.workOrderMaterialRepository.find({
      where: { workOrderId },
      relations: ['materialItem'],
      order: { createdAt: 'DESC' },
    });
  }

  async addMaterial(
    workOrderId: string,
    addMaterialDto: AddMaterialDto,
    user: RequestUser,
  ): Promise<WorkOrderMaterial> {
    const workOrder = await this.findOne(workOrderId, user);

    const material = this.workOrderMaterialRepository.create({
      ...addMaterialDto,
      workOrderId,
    });

    return (await this.workOrderMaterialRepository.save(material)) as any;
  }
}
