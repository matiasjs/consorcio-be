import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inspection } from '../../entities/inspection.entity';
import { CreateInspectionDto, UpdateInspectionDto } from './dto';
import { PaginationDto } from '../../common/dto';
import { RequestUser } from '../../common/interfaces';

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(Inspection)
    private readonly inspectionRepository: Repository<Inspection>,
  ) {}

  async create(createInspectionDto: CreateInspectionDto, user: RequestUser): Promise<Inspection> {
    const inspection = this.inspectionRepository.create({
      ...createInspectionDto,
      adminId: user.adminId,
      scheduledAt: new Date(createInspectionDto.scheduledAt),
    });

    return await this.inspectionRepository.save(inspection);
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: Inspection[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;
    const skip = (page - 1) * limit;

    const queryBuilder = this.inspectionRepository
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.ticket', 'ticket')
      .leftJoinAndSelect('inspection.inspector', 'inspector')
      .where('inspection.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(inspection.notes ILIKE :search OR inspection.findings ILIKE :search OR inspection.recommendations ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`inspection.${sortBy}`, sortOrder as 'ASC' | 'DESC')
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

  async findOne(id: string, user: RequestUser): Promise<Inspection> {
    const inspection = await this.inspectionRepository.findOne({
      where: { id, adminId: user.adminId },
      relations: ['ticket', 'inspector'],
    });

    if (!inspection) {
      throw new NotFoundException(`Inspection with ID ${id} not found`);
    }

    return inspection;
  }

  async update(id: string, updateInspectionDto: UpdateInspectionDto, user: RequestUser): Promise<Inspection> {
    const inspection = await this.findOne(id, user);

    const updateData: any = { ...updateInspectionDto };
    if (updateInspectionDto.scheduledAt) {
      updateData.scheduledAt = new Date(updateInspectionDto.scheduledAt);
    }

    Object.assign(inspection, updateData);
    return await this.inspectionRepository.save(inspection);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    const inspection = await this.findOne(id, user);
    await this.inspectionRepository.softDelete(id);
  }
}
