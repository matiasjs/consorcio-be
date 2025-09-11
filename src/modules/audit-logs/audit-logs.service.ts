import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import type { RequestUser } from '../../common/interfaces';
import { AuditLog } from '../../entities/audit-log.entity';
import { CreateAuditLogDto } from './dto';

@Injectable()
export class AuditLogsService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(
    createAuditLogDto: CreateAuditLogDto,
    user: RequestUser,
  ): Promise<AuditLog> {
    const auditData: any = {
      adminId: user.adminId,
      actorUserId: createAuditLogDto.userId || user.id,
      action: createAuditLogDto.action,
      entity: createAuditLogDto.entityType,
      entityId: createAuditLogDto.entityId,
      description: createAuditLogDto.description,
      ip: createAuditLogDto.ipAddress,
      userAgent: createAuditLogDto.userAgent,
      metadata: createAuditLogDto.metadata,
      diff:
        createAuditLogDto.oldValues || createAuditLogDto.newValues
          ? {
              before: createAuditLogDto.oldValues,
              after: createAuditLogDto.newValues,
            }
          : undefined,
    };

    const auditLog = this.auditLogRepository.create(auditData);
    return (await this.auditLogRepository.save(auditLog)) as any;
  }

  async findAll(
    user: RequestUser,
    paginationDto: PaginationDto,
  ): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
  }> {
    const {
      page = 1,
      limit = 10,
      search,
      sortBy = 'timestamp',
      sortOrder = 'DESC',
    } = paginationDto;

    const queryBuilder = this.auditLogRepository.createQueryBuilder('audit');

    queryBuilder.where('audit.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(audit.description ILIKE :search OR audit.action ILIKE :search OR audit.entityType ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`audit.createdAt`, sortOrder)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findByEntity(
    entityType: string,
    entityId: string,
    user: RequestUser,
  ): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: {
        adminId: user.adminId,
        entity: entityType as any,
        entityId,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, user: RequestUser): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: {
        adminId: user.adminId,
        actorUserId: userId,
      },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByAction(action: string, user: RequestUser): Promise<AuditLog[]> {
    return await this.auditLogRepository.find({
      where: {
        adminId: user.adminId,
        action: action as any,
      },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByDateRange(
    startDate: string,
    endDate: string,
    user: RequestUser,
  ): Promise<AuditLog[]> {
    return await this.auditLogRepository
      .createQueryBuilder('audit')
      .where('audit.adminId = :adminId', { adminId: user.adminId })
      .andWhere('audit.timestamp >= :startDate', { startDate })
      .andWhere('audit.timestamp <= :endDate', { endDate })
      .orderBy('audit.createdAt', 'DESC')
      .getMany();
  }

  async getStatsByAction(user: RequestUser): Promise<any> {
    const stats = await this.auditLogRepository
      .createQueryBuilder('audit')
      .select('audit.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('audit.adminId = :adminId', { adminId: user.adminId })
      .groupBy('audit.action')
      .getRawMany();

    return stats;
  }

  async getStatsByEntityType(user: RequestUser): Promise<any> {
    const stats = await this.auditLogRepository
      .createQueryBuilder('audit')
      .select('audit.entityType', 'entityType')
      .addSelect('COUNT(*)', 'count')
      .where('audit.adminId = :adminId', { adminId: user.adminId })
      .groupBy('audit.entityType')
      .getRawMany();

    return stats;
  }

  async findOne(id: string, user: RequestUser): Promise<AuditLog | null> {
    return await this.auditLogRepository.findOne({
      where: { id, adminId: user.adminId },
    });
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    await this.auditLogRepository.delete({ id, adminId: user.adminId });
  }
}
