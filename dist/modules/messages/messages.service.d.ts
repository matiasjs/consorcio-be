import { Repository } from 'typeorm';
import { Message } from '../../entities/message.entity';
import { CreateMessageDto } from './dto';
export declare class MessagesService {
    private messageRepository;
    constructor(messageRepository: Repository<Message>);
    create(createMessageDto: CreateMessageDto, authorUserId?: string): Promise<Message>;
    findByEntity(entityType: string, entityId: string, page?: number, limit?: number): Promise<{
        data: Message[];
        total: number;
        page: number;
        limit: number;
    }>;
    markAsRead(id: string, readByUserId: string): Promise<Message>;
    getUnreadCount(entityType: string, entityId: string): Promise<number>;
}
