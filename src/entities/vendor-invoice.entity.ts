import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
import { Vendor } from './vendor.entity';
import { Payment } from './payment.entity';

export enum InvoiceStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
  PARTIALLY_PAID = 'PARTIALLY_PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

@Entity('vendor_invoices')
@Index(['workOrderId'])
@Index(['vendorId'])
@Index(['number'])
@Index(['status'])
@Index(['issueDate'])
@Index(['dueDate'])
export class VendorInvoice extends BaseEntity {
  @Column({ type: 'uuid' })
  workOrderId: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({ type: 'varchar', length: 100 })
  number: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountSubtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  materialsAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  laborAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.DRAFT,
  })
  status: InvoiceStatus;

  @Column({ type: 'json', nullable: true })
  files?: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number;
    uploadedAt: Date;
  }>;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  lineItems?: Array<{
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  purchaseOrderNumber?: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  taxRate?: number; // percentage

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentTerms?: string;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  approvedByUserId?: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  remainingAmount: number;

  // Relations
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.invoices)
  @JoinColumn({ name: 'workOrderId' })
  workOrder: WorkOrder;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @OneToMany(() => Payment, (payment) => payment.vendorInvoice)
  payments: Payment[];
}
