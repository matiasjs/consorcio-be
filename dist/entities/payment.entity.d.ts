import { BaseEntity } from './base.entity';
import { VendorInvoice } from './vendor-invoice.entity';
export declare enum PaymentMethod {
    CASH = "CASH",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHECK = "CHECK",
    CREDIT_CARD = "CREDIT_CARD",
    DEBIT_CARD = "DEBIT_CARD",
    DIGITAL_WALLET = "DIGITAL_WALLET",
    CRYPTOCURRENCY = "CRYPTOCURRENCY",
    OTHER = "OTHER"
}
export declare enum PaymentStatus {
    SCHEDULED = "SCHEDULED",
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare class Payment extends BaseEntity {
    vendorInvoiceId: string;
    method: PaymentMethod;
    scheduledFor?: Date;
    paidAt?: Date;
    amount: number;
    currency: string;
    status: PaymentStatus;
    reference?: string;
    notes?: string;
    bankAccount?: string;
    checkNumber?: string;
    authorizationCode?: string;
    exchangeRate?: number;
    originalCurrency?: string;
    originalAmount?: number;
    fees: number;
    failureReason?: string;
    processedByUserId?: string;
    processedAt?: Date;
    attachments?: Array<{
        filename: string;
        url: string;
        description?: string;
    }>;
    metadata?: Record<string, any>;
    vendorInvoice: VendorInvoice;
}
