import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import type { RequestUser } from '../../common/interfaces';
import { Subscription } from '../../entities/subscription.entity';
import { CreateSubscriptionDto, UpdateSubscriptionDto } from './dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
  ) {}

  async create(
    createSubscriptionDto: CreateSubscriptionDto,
    user: RequestUser,
  ): Promise<Subscription> {
    const subscriptionData: any = {
      ...createSubscriptionDto,
      adminId: user.adminId,
      startDate: new Date(createSubscriptionDto.startDate),
      endDate: createSubscriptionDto.endDate
        ? new Date(createSubscriptionDto.endDate)
        : null,
    };

    const subscription = this.subscriptionRepository.create(subscriptionData);
    return (await this.subscriptionRepository.save(subscription)) as any;
  }

  async findAll(
    user: RequestUser,
    paginationDto: PaginationDto,
  ): Promise<{
    data: Subscription[];
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

    const queryBuilder =
      this.subscriptionRepository.createQueryBuilder('subscription');

    queryBuilder.where('subscription.adminId = :adminId', {
      adminId: user.adminId,
    });

    if (search) {
      queryBuilder.andWhere(
        '(subscription.name ILIKE :search OR subscription.description ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    queryBuilder
      .orderBy(`subscription.${sortBy}`, sortOrder)
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

  async findActive(user: RequestUser): Promise<Subscription[]> {
    return await this.subscriptionRepository.find({
      where: {
        adminId: user.adminId,
        status: 'ACTIVE' as any,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findExpiring(user: RequestUser): Promise<Subscription[]> {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    return await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.adminId = :adminId', { adminId: user.adminId })
      .andWhere('subscription.status = :status', { status: 'ACTIVE' })
      .andWhere('subscription.endDate <= :expiryDate', {
        expiryDate: thirtyDaysFromNow,
      })
      .orderBy('subscription.endDate', 'ASC')
      .getMany();
  }

  async findOne(id: string, user: RequestUser): Promise<Subscription | null> {
    return await this.subscriptionRepository.findOne({
      where: { id, adminId: user.adminId },
    });
  }

  async update(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
    user: RequestUser,
  ): Promise<Subscription | null> {
    const updateData: any = { ...updateSubscriptionDto };

    if (updateSubscriptionDto.startDate) {
      updateData.startDate = new Date(updateSubscriptionDto.startDate);
    }
    if (updateSubscriptionDto.endDate) {
      updateData.endDate = new Date(updateSubscriptionDto.endDate);
    }

    await this.subscriptionRepository.update(
      { id, adminId: user.adminId },
      updateData,
    );
    return this.findOne(id, user);
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    await this.subscriptionRepository.delete({ id, adminId: user.adminId });
  }
}
