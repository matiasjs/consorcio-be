import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { CreateMessageDto } from './dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messageRepository: Repository<Message>,
  ) {}

  async create(createMessageDto: CreateMessageDto, authorUserId?: string): Promise<Message> {
    const message = this.messageRepository.create({
      ...createMessageDto,
      authorUserId,
    });

    return this.messageRepository.save(message);
  }

  async findByEntity(
    entityType: string,
    entityId: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<{ data: Message[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.messageRepository.findAndCount({
      where: { entityType: entityType as any, entityId },
      relations: ['author', 'readByUser'],
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }

  async markAsRead(id: string, readByUserId: string): Promise<Message> {
    const message = await this.messageRepository.findOne({
      where: { id },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    message.isRead = true;
    message.readAt = new Date();
    message.readByUserId = readByUserId;

    return this.messageRepository.save(message);
  }

  async getUnreadCount(entityType: string, entityId: string): Promise<number> {
    return this.messageRepository.count({
      where: {
        entityType: entityType as any,
        entityId,
        isRead: false,
      },
    });
  }
}
