import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
import { Vendor } from './vendor.entity';
export declare enum QuoteStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    EXPIRED = "EXPIRED",
    CANCELLED = "CANCELLED"
}
export declare class Quote extends BaseEntity {
    workOrderId: string;
    vendorId: string;
    amountSubtotal: number;
    materialsEstimate: number;
    laborCost: number;
    taxes: number;
    total: number;
    currency: string;
    status: QuoteStatus;
    description?: string;
    materialBreakdown?: Array<{
        name: string;
        quantity: number;
        unit: string;
        unitPrice: number;
        total: number;
    }>;
    estimatedDurationHours?: number;
    validUntil?: Date;
    terms?: string;
    notes?: string;
    attachments?: Array<{
        filename: string;
        url: string;
        description?: string;
    }>;
    submittedAt?: Date;
    reviewedAt?: Date;
    reviewedByUserId?: string;
    rejectionReason?: string;
    workOrder: WorkOrder;
    vendor: Vendor;
}
