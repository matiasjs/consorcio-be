import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
import { Vendor } from './vendor.entity';

export enum QuoteStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Entity('quotes')
@Index(['workOrderId'])
@Index(['vendorId'])
@Index(['status'])
export class Quote extends BaseEntity {
  @Column({ type: 'uuid' })
  workOrderId: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amountSubtotal: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  materialsEstimate: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  laborCost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  taxes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({
    type: 'enum',
    enum: QuoteStatus,
    default: QuoteStatus.DRAFT,
  })
  status: QuoteStatus;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  materialBreakdown?: Array<{
    name: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    total: number;
  }>;

  @Column({ type: 'int', nullable: true })
  estimatedDurationHours?: number;

  @Column({ type: 'date', nullable: true })
  validUntil?: Date;

  @Column({ type: 'text', nullable: true })
  terms?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  attachments?: Array<{
    filename: string;
    url: string;
    description?: string;
  }>;

  @Column({ type: 'timestamp', nullable: true })
  submittedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  reviewedByUserId?: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  // Relations
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.quotes)
  @JoinColumn({ name: 'workOrderId' })
  workOrder: WorkOrder;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}
