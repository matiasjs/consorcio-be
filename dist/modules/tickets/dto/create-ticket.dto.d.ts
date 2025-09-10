import { TicketType, TicketPriority, TicketChannel } from '../../../entities/ticket.entity';
declare class AttachmentDto {
    filename: string;
    url: string;
    mimeType: string;
    size: number;
}
export declare class CreateTicketDto {
    buildingId: string;
    unitId?: string;
    type: TicketType;
    channel?: TicketChannel;
    title: string;
    description: string;
    priority?: TicketPriority;
    attachments?: AttachmentDto[];
    dueDate?: string;
    estimatedCost?: number;
    currency?: string;
}
export {};
