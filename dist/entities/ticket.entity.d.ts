import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Building } from './building.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';
import { Inspection } from './inspection.entity';
import { WorkOrder } from './work-order.entity';
import { Message } from './message.entity';
export declare enum TicketType {
    MAINTENANCE = "MAINTENANCE",
    REPAIR = "REPAIR",
    COMPLAINT = "COMPLAINT",
    EMERGENCY = "EMERGENCY",
    CLEANING = "CLEANING",
    SECURITY = "SECURITY",
    OTHER = "OTHER"
}
export declare enum TicketStatus {
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    PENDING_INSPECTION = "PENDING_INSPECTION",
    PENDING_QUOTE = "PENDING_QUOTE",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    COMPLETED = "COMPLETED",
    CLOSED = "CLOSED",
    CANCELLED = "CANCELLED"
}
export declare enum TicketPriority {
    LOW = "LOW",
    MEDIUM = "MEDIUM",
    HIGH = "HIGH",
    URGENT = "URGENT",
    EMERGENCY = "EMERGENCY"
}
export declare enum TicketChannel {
    WEB = "WEB",
    MOBILE = "MOBILE",
    PHONE = "PHONE",
    EMAIL = "EMAIL",
    WHATSAPP = "WHATSAPP",
    IN_PERSON = "IN_PERSON"
}
export declare class Ticket extends BaseEntity {
    adminId: string;
    buildingId: string;
    unitId?: string;
    createdByUserId: string;
    type: TicketType;
    channel: TicketChannel;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    attachments?: Array<{
        filename: string;
        url: string;
        mimeType: string;
        size: number;
    }>;
    resolution?: string;
    resolvedAt?: Date;
    resolvedByUserId?: string;
    dueDate?: Date;
    estimatedCost?: number;
    currency: string;
    administration: Administration;
    building: Building;
    unit?: Unit;
    createdByUser: User;
    resolvedByUser?: User;
    inspections: Inspection[];
    workOrders: WorkOrder[];
    messages: Message[];
}
