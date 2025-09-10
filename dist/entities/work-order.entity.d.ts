import { BaseEntity } from './base.entity';
import { Ticket } from './ticket.entity';
import { Vendor } from './vendor.entity';
import { User } from './user.entity';
import { Quote } from './quote.entity';
import { ScheduleSlot } from './schedule-slot.entity';
import { WorkOrderMaterial } from './work-order-material.entity';
import { VendorInvoice } from './vendor-invoice.entity';
export declare enum WorkOrderStatus {
    DRAFT = "DRAFT",
    PENDING_QUOTE = "PENDING_QUOTE",
    QUOTED = "QUOTED",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    SCHEDULED = "SCHEDULED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
    ON_HOLD = "ON_HOLD"
}
export declare class WorkOrder extends BaseEntity {
    ticketId: string;
    vendorId: string;
    assignedByUserId: string;
    scopeOfWork: string;
    scheduledAt?: Date;
    status: WorkOrderStatus;
    beforePhotos?: Array<{
        filename: string;
        url: string;
        description?: string;
        timestamp: Date;
    }>;
    afterPhotos?: Array<{
        filename: string;
        url: string;
        description?: string;
        timestamp: Date;
    }>;
    materialsPlan?: Array<{
        materialId: string;
        materialName: string;
        quantity: number;
        unit: string;
        estimatedCost?: number;
    }>;
    notes?: string;
    startedAt?: Date;
    completedAt?: Date;
    estimatedDurationHours?: number;
    actualDurationHours?: number;
    estimatedCost?: number;
    actualCost?: number;
    currency: string;
    completionNotes?: string;
    qualityRating?: number;
    qualityFeedback?: string;
    ticket: Ticket;
    vendor: Vendor;
    assignedByUser: User;
    quotes: Quote[];
    scheduleSlots: ScheduleSlot[];
    materials: WorkOrderMaterial[];
    invoices: VendorInvoice[];
}
