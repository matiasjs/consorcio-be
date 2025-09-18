import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Quote } from './quote.entity';
import { ScheduleSlot } from './schedule-slot.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';
import { VendorInvoice } from './vendor-invoice.entity';
import { Vendor } from './vendor.entity';
import { WorkOrderMaterial } from './work-order-material.entity';

export enum WorkOrderStatus {
  DRAFT = 'DRAFT',
  PENDING_QUOTE = 'PENDING_QUOTE',
  QUOTED = 'QUOTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  ON_HOLD = 'ON_HOLD',
}

@Entity('work_orders')
@Index(['adminId'])
@Index(['ticketId'])
@Index(['vendorId'])
@Index(['assignedByUserId'])
@Index(['status'])
@Index(['scheduledAt'])
export class WorkOrder extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  ticketId: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({ type: 'uuid' })
  assignedByUserId: string;

  @Column({ type: 'text' })
  scopeOfWork: string;

  @Column({ type: 'timestamp', nullable: true })
  scheduledAt?: Date;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.DRAFT,
  })
  status: WorkOrderStatus;

  @Column({ type: 'json', nullable: true })
  beforePhotos?: Array<{
    filename: string;
    url: string;
    description?: string;
    timestamp: Date;
  }>;

  @Column({ type: 'json', nullable: true })
  afterPhotos?: Array<{
    filename: string;
    url: string;
    description?: string;
    timestamp: Date;
  }>;

  @Column({ type: 'json', nullable: true })
  materialsPlan?: Array<{
    materialId: string;
    materialName: string;
    quantity: number;
    unit: string;
    estimatedCost?: number;
  }>;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'int', nullable: true })
  estimatedDurationHours?: number;

  @Column({ type: 'int', nullable: true })
  actualDurationHours?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  completionNotes?: string;

  @Column({ type: 'int', nullable: true, default: 0 })
  qualityRating?: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  qualityFeedback?: string;

  // Relations
  @ManyToOne(() => Ticket, (ticket) => ticket.workOrders)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedByUserId' })
  assignedByUser: User;

  @OneToMany(() => Quote, (quote) => quote.workOrder)
  quotes: Quote[];

  @OneToMany(() => ScheduleSlot, (slot) => slot.workOrder)
  scheduleSlots: ScheduleSlot[];

  @OneToMany(() => WorkOrderMaterial, (material) => material.workOrder)
  materials: WorkOrderMaterial[];

  @OneToMany(() => VendorInvoice, (invoice) => invoice.workOrder)
  invoices: VendorInvoice[];
}
