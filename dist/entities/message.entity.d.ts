import { BaseEntity } from './base.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';
export declare enum MessageDirection {
    INBOUND = "INBOUND",
    OUTBOUND = "OUTBOUND",
    INTERNAL = "INTERNAL"
}
export declare enum MessageChannel {
    WEB = "WEB",
    MOBILE = "MOBILE",
    EMAIL = "EMAIL",
    WHATSAPP = "WHATSAPP",
    SMS = "SMS",
    PHONE = "PHONE",
    SYSTEM = "SYSTEM"
}
export declare enum EntityType {
    TICKET = "TICKET",
    WORK_ORDER = "WORK_ORDER",
    INSPECTION = "INSPECTION",
    MEETING = "MEETING",
    BUILDING = "BUILDING",
    UNIT = "UNIT"
}
export declare class Message extends BaseEntity {
    entityType: EntityType;
    entityId: string;
    authorUserId?: string;
    direction: MessageDirection;
    channel: MessageChannel;
    body: string;
    attachments?: Array<{
        filename: string;
        url: string;
        mimeType: string;
        size: number;
    }>;
    isRead: boolean;
    readAt?: Date;
    readByUserId?: string;
    subject?: string;
    fromEmail?: string;
    toEmail?: string;
    fromPhone?: string;
    toPhone?: string;
    externalId?: string;
    metadata?: Record<string, any>;
    author?: User;
    readByUser?: User;
    ticket?: Ticket;
}
