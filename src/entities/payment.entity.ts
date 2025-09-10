import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VendorInvoice } from './vendor-invoice.entity';

export enum PaymentMethod {
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHECK = 'CHECK',
  CREDIT_CARD = 'CREDIT_CARD',
  DEBIT_CARD = 'DEBIT_CARD',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  CRYPTOCURRENCY = 'CRYPTOCURRENCY',
  OTHER = 'OTHER',
}

export enum PaymentStatus {
  SCHEDULED = 'SCHEDULED',
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

@Entity('payments')
@Index(['adminId'])
@Index(['vendorInvoiceId'])
@Index(['status'])
@Index(['scheduledFor'])
@Index(['paidAt'])
export class Payment extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  vendorInvoiceId: string;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
  })
  method: PaymentMethod;

  @Column({ type: 'date', nullable: true })
  scheduledFor?: Date;

  @Column({ type: 'timestamp', nullable: true })
  paidAt?: Date;

  @Column({ type: 'date', nullable: true })
  paymentDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.SCHEDULED,
  })
  status: PaymentStatus;

  @Column({ type: 'varchar', length: 255, nullable: true })
  reference?: string; // Transaction ID, check number, etc.

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  bankAccount?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  checkNumber?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  authorizationCode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  exchangeRate?: number;

  @Column({ type: 'varchar', length: 10, nullable: true })
  originalCurrency?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  originalAmount?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  fees: number;

  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  @Column({ type: 'uuid', nullable: true })
  processedByUserId?: string;

  @Column({ type: 'timestamp', nullable: true })
  processedAt?: Date;

  @Column({ type: 'json', nullable: true })
  attachments?: Array<{
    filename: string;
    url: string;
    description?: string;
  }>;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // For external payment system data

  // Relations
  @ManyToOne(() => VendorInvoice, (invoice) => invoice.payments)
  @JoinColumn({ name: 'vendorInvoiceId' })
  vendorInvoice: VendorInvoice;
}
