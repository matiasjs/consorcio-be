import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import type { RequestUser } from '../../common/interfaces';
import { UsageMetric } from '../../entities/usage-metric.entity';
import { CreateUsageMetricDto } from './dto';

@Injectable()
export class UsageMetricsService {
  constructor(
    @InjectRepository(UsageMetric)
    private readonly usageMetricRepository: Repository<UsageMetric>,
  ) { }

  async create(createUsageMetricDto: CreateUsageMetricDto, user: RequestUser): Promise<UsageMetric> {
    const metricData: any = {
      adminId: user.adminId,
      metric: createUsageMetricDto.type,
      period: 'DAILY',
      periodStart: new Date(),
      periodEnd: new Date(),
      value: createUsageMetricDto.value || 1,
      unit: createUsageMetricDto.unit,
      metadata: createUsageMetricDto.metadata,
      calculatedAt: createUsageMetricDto.timestamp ? new Date(createUsageMetricDto.timestamp) : new Date(),
    };

    const metric = this.usageMetricRepository.create(metricData);
    return await this.usageMetricRepository.save(metric) as any;
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: UsageMetric[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.usageMetricRepository.createQueryBuilder('metric');

    queryBuilder.where('metric.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(metric.metric ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`metric.${sortBy}`, sortOrder)
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

  async findByType(type: string, user: RequestUser): Promise<UsageMetric[]> {
    return await this.usageMetricRepository.find({
      where: {
        adminId: user.adminId,
        metric: type as any,
      },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async findByUser(userId: string, user: RequestUser): Promise<UsageMetric[]> {
    return await this.usageMetricRepository.find({
      where: {
        adminId: user.adminId,
      },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async getStatsByType(user: RequestUser): Promise<any> {
    const stats = await this.usageMetricRepository
      .createQueryBuilder('metric')
      .select('metric.metric', 'type')
      .addSelect('COUNT(*)', 'count')
      .addSelect('SUM(metric.value)', 'total_value')
      .where('metric.adminId = :adminId', { adminId: user.adminId })
      .groupBy('metric.metric')
      .getRawMany();

    return stats;
  }

  async getStatsByDateRange(startDate: string, endDate: string, user: RequestUser): Promise<any> {
    const stats = await this.usageMetricRepository
      .createQueryBuilder('metric')
      .select('DATE(metric.createdAt)', 'date')
      .addSelect('metric.metric', 'type')
      .addSelect('COUNT(*)', 'count')
      .where('metric.adminId = :adminId', { adminId: user.adminId })
      .andWhere('metric.createdAt >= :startDate', { startDate })
      .andWhere('metric.createdAt <= :endDate', { endDate })
      .groupBy('DATE(metric.createdAt), metric.metric')
      .orderBy('DATE(metric.createdAt)', 'ASC')
      .getRawMany();

    return stats;
  }

  async findOne(id: string, user: RequestUser): Promise<UsageMetric | null> {
    return await this.usageMetricRepository.findOne({
      where: { id, adminId: user.adminId },
    }) as any;
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    await this.usageMetricRepository.delete({ id, adminId: user.adminId });
  }
}
