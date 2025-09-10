import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto';
export declare class MessagesController {
    private readonly messagesService;
    constructor(messagesService: MessagesService);
    create(createMessageDto: CreateMessageDto, user: any): Promise<import("../../entities").Message>;
    findByEntity(entityType: string, entityId: string, page?: number, limit?: number): Promise<{
        data: import("../../entities").Message[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUnreadCount(entityType: string, entityId: string): Promise<number>;
    markAsRead(id: string, user: any): Promise<import("../../entities").Message>;
}
