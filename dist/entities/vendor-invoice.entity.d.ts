import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
import { Vendor } from './vendor.entity';
import { Payment } from './payment.entity';
export declare enum InvoiceStatus {
    DRAFT = "DRAFT",
    SUBMITTED = "SUBMITTED",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    PAID = "PAID",
    PARTIALLY_PAID = "PARTIALLY_PAID",
    OVERDUE = "OVERDUE",
    CANCELLED = "CANCELLED"
}
export declare class VendorInvoice extends BaseEntity {
    workOrderId: string;
    vendorId: string;
    number: string;
    issueDate: Date;
    dueDate?: Date;
    amountSubtotal: number;
    materialsAmount: number;
    laborAmount: number;
    taxes: number;
    total: number;
    currency: string;
    status: InvoiceStatus;
    files?: Array<{
        filename: string;
        url: string;
        mimeType: string;
        size: number;
        uploadedAt: Date;
    }>;
    description?: string;
    lineItems?: Array<{
        description: string;
        quantity: number;
        unitPrice: number;
        total: number;
    }>;
    notes?: string;
    purchaseOrderNumber?: string;
    taxRate?: number;
    paymentTerms?: string;
    submittedAt?: Date;
    approvedAt?: Date;
    approvedByUserId?: string;
    rejectionReason?: string;
    paidAmount: number;
    remainingAmount: number;
    workOrder: WorkOrder;
    vendor: Vendor;
    payments: Payment[];
}
