import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from '../../common/dto';
import type { RequestUser } from '../../common/interfaces';
import { Notification } from '../../entities/notification.entity';
import { CreateNotificationDto, UpdateNotificationDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
  ) { }

  async create(createNotificationDto: CreateNotificationDto, user: RequestUser): Promise<Notification> {
    const notification = this.notificationRepository.create({
      ...createNotificationDto,
      adminId: user.adminId,
      sentByUserId: user.id,
    } as any);

    return await this.notificationRepository.save(notification) as any;
  }

  async findAll(user: RequestUser, paginationDto: PaginationDto): Promise<{
    data: Notification[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, search, sortBy = 'createdAt', sortOrder = 'DESC' } = paginationDto;

    const queryBuilder = this.notificationRepository.createQueryBuilder('notification');

    queryBuilder.where('notification.adminId = :adminId', { adminId: user.adminId });

    if (search) {
      queryBuilder.andWhere(
        '(notification.title ILIKE :search OR notification.message ILIKE :search)',
        { search: `%${search}%` }
      );
    }

    queryBuilder
      .orderBy(`notification.${sortBy}`, sortOrder)
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

  async findUnread(user: RequestUser): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: {
        adminId: user.adminId,
        targetUserId: user.id,
        isRead: false,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userId: string, user: RequestUser): Promise<Notification[]> {
    return await this.notificationRepository.find({
      where: {
        adminId: user.adminId,
        targetUserId: userId,
      },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, user: RequestUser): Promise<Notification | null> {
    return await this.notificationRepository.findOne({
      where: { id, adminId: user.adminId },
    });
  }

  async update(id: string, updateNotificationDto: UpdateNotificationDto, user: RequestUser): Promise<Notification | null> {
    await this.notificationRepository.update(
      { id, adminId: user.adminId },
      updateNotificationDto as any
    );
    return this.findOne(id, user);
  }

  async markAsRead(id: string, user: RequestUser): Promise<Notification | null> {
    await this.notificationRepository.update(
      { id, adminId: user.adminId },
      { isRead: true, readAt: new Date() }
    );
    return this.findOne(id, user);
  }

  async markAllAsRead(user: RequestUser): Promise<void> {
    await this.notificationRepository.update(
      { adminId: user.adminId, targetUserId: user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
  }

  async remove(id: string, user: RequestUser): Promise<void> {
    await this.notificationRepository.delete({ id, adminId: user.adminId });
  }
}
