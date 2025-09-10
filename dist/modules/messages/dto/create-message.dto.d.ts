import { EntityType, MessageDirection, MessageChannel } from '../../../entities/message.entity';
declare class AttachmentDto {
    filename: string;
    url: string;
    mimeType: string;
    size: number;
}
export declare class CreateMessageDto {
    entityType: EntityType;
    entityId: string;
    direction: MessageDirection;
    channel: MessageChannel;
    body: string;
    attachments?: AttachmentDto[];
    subject?: string;
    fromEmail?: string;
    toEmail?: string;
    fromPhone?: string;
    toPhone?: string;
}
export {};
