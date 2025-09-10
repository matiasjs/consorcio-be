import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { MaintenancePlan } from './maintenance-plan.entity';
import { User } from './user.entity';
import { Vendor } from './vendor.entity';

export enum TaskStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  OVERDUE = 'OVERDUE',
  RESCHEDULED = 'RESCHEDULED',
}

export enum PerformedByType {
  USER = 'USER',
  VENDOR = 'VENDOR',
}

@Entity('maintenance_tasks')
@Index(['planId'])
@Index(['scheduledFor'])
@Index(['status'])
@Index(['performedByUserId'])
@Index(['performedByVendorId'])
export class MaintenanceTask extends BaseEntity {
  @Column({ type: 'uuid' })
  planId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  scheduledFor: Date;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.SCHEDULED,
  })
  status: TaskStatus;

  @Column({
    type: 'enum',
    enum: PerformedByType,
    nullable: true,
  })
  performedByType?: PerformedByType;

  @Column({ type: 'uuid', nullable: true })
  performedByUserId?: string;

  @Column({ type: 'uuid', nullable: true })
  performedByVendorId?: string;

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  completedAt?: Date;

  @Column({ type: 'int', nullable: true })
  actualDurationMinutes?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  evidencePhotos?: Array<{
    filename: string;
    url: string;
    description?: string;
    timestamp: Date;
  }>;

  @Column({ type: 'json', nullable: true })
  completedTasks?: Array<{
    name: string;
    completed: boolean;
    notes?: string;
  }>;

  @Column({ type: 'text', nullable: true })
  findings?: string;

  @Column({ type: 'text', nullable: true })
  recommendations?: string;

  @Column({ type: 'boolean', default: false })
  requiresFollowUp: boolean;

  @Column({ type: 'date', nullable: true })
  followUpDate?: Date;

  @Column({ type: 'text', nullable: true })
  followUpNotes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  materialsUsed?: Array<{
    name: string;
    quantity: number;
    unit: string;
    cost?: number;
  }>;

  @Column({ type: 'int', nullable: true, default: 0 })
  qualityRating?: number; // 1-5 stars

  @Column({ type: 'text', nullable: true })
  qualityFeedback?: string;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  rescheduledFrom?: Date;

  @Column({ type: 'text', nullable: true })
  rescheduleReason?: string;

  // Relations
  @ManyToOne(() => MaintenancePlan, (plan) => plan.tasks)
  @JoinColumn({ name: 'planId' })
  plan: MaintenancePlan;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'performedByUserId' })
  performedByUser?: User;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'performedByVendorId' })
  performedByVendor?: Vendor;
}
