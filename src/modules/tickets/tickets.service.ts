import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket, TicketStatus } from '../../entities/ticket.entity';
import { Inspection, InspectionStatus } from '../../entities/inspection.entity';
import { CreateTicketDto, UpdateTicketDto, AssignInspectorDto } from './dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
    @InjectRepository(Inspection)
    private inspectionRepository: Repository<Inspection>,
  ) {}

  async create(createTicketDto: CreateTicketDto, createdByUserId: string, adminId: string): Promise<Ticket> {
    const ticket = this.ticketRepository.create({
      ...createTicketDto,
      createdByUserId,
      adminId,
      dueDate: createTicketDto.dueDate ? new Date(createTicketDto.dueDate) : undefined,
    });

    return this.ticketRepository.save(ticket);
  }

  async findAll(
    adminId: string,
    page: number = 1,
    limit: number = 10,
    status?: TicketStatus,
    buildingId?: string,
    unitId?: string,
  ): Promise<{ data: Ticket[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.ticketRepository
      .createQueryBuilder('ticket')
      .leftJoinAndSelect('ticket.building', 'building')
      .leftJoinAndSelect('ticket.unit', 'unit')
      .leftJoinAndSelect('ticket.createdByUser', 'createdByUser')
      .leftJoinAndSelect('ticket.inspections', 'inspections')
      .leftJoinAndSelect('ticket.workOrders', 'workOrders')
      .where('ticket.adminId = :adminId', { adminId });

    if (status) {
      queryBuilder.andWhere('ticket.status = :status', { status });
    }

    if (buildingId) {
      queryBuilder.andWhere('ticket.buildingId = :buildingId', { buildingId });
    }

    if (unitId) {
      queryBuilder.andWhere('ticket.unitId = :unitId', { unitId });
    }

    const [data, total] = await queryBuilder
      .orderBy('ticket.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  async findOne(id: string, adminId: string): Promise<Ticket> {
    const ticket = await this.ticketRepository.findOne({
      where: { id, adminId },
      relations: [
        'building',
        'unit',
        'createdByUser',
        'resolvedByUser',
        'inspections',
        'inspections.inspector',
        'workOrders',
        'workOrders.vendor',
        'messages',
        'messages.author',
      ],
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(id: string, updateTicketDto: UpdateTicketDto, adminId: string): Promise<Ticket> {
    const ticket = await this.findOne(id, adminId);

    Object.assign(ticket, {
      ...updateTicketDto,
      resolvedAt: updateTicketDto.resolvedAt ? new Date(updateTicketDto.resolvedAt) : ticket.resolvedAt,
      dueDate: updateTicketDto.dueDate ? new Date(updateTicketDto.dueDate) : ticket.dueDate,
    });

    return this.ticketRepository.save(ticket);
  }

  async remove(id: string, adminId: string): Promise<void> {
    const ticket = await this.findOne(id, adminId);
    await this.ticketRepository.softRemove(ticket);
  }

  async assignInspector(
    ticketId: string,
    assignInspectorDto: AssignInspectorDto,
    adminId: string,
  ): Promise<Inspection> {
    const ticket = await this.findOne(ticketId, adminId);

    // Check if there's already a pending inspection
    const existingInspection = await this.inspectionRepository.findOne({
      where: {
        ticketId,
        status: InspectionStatus.SCHEDULED,
      },
    });

    if (existingInspection) {
      throw new ForbiddenException('Ticket already has a pending inspection');
    }

    const inspection = this.inspectionRepository.create({
      ticketId,
      inspectorUserId: assignInspectorDto.inspectorUserId,
      scheduledAt: new Date(assignInspectorDto.scheduledAt),
      notes: assignInspectorDto.notes,
    });

    // Update ticket status
    ticket.status = TicketStatus.PENDING_INSPECTION;
    await this.ticketRepository.save(ticket);

    return this.inspectionRepository.save(inspection);
  }

  async getTicketsByStatus(adminId: string): Promise<Record<string, number>> {
    const result = await this.ticketRepository
      .createQueryBuilder('ticket')
      .select('ticket.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('ticket.adminId = :adminId', { adminId })
      .groupBy('ticket.status')
      .getRawMany();

    const statusCounts: Record<string, number> = {};
    result.forEach((row) => {
      statusCounts[row.status] = parseInt(row.count);
    });

    return statusCounts;
  }
}
