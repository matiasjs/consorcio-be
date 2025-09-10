import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';

export enum ScheduleSlotStatus {
  PROPOSED = 'PROPOSED',
  CONFIRMED = 'CONFIRMED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum ProposedBy {
  VENDOR = 'VENDOR',
  ADMINISTRATION = 'ADMINISTRATION',
  SYSTEM = 'SYSTEM',
}

@Entity('schedule_slots')
@Index(['workOrderId'])
@Index(['start'])
@Index(['status'])
export class ScheduleSlot extends BaseEntity {
  @Column({ type: 'uuid' })
  workOrderId: string;

  @Column({
    type: 'enum',
    enum: ProposedBy,
  })
  proposedBy: ProposedBy;

  @Column({ type: 'timestamp' })
  start: Date;

  @Column({ type: 'timestamp' })
  end: Date;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ScheduleSlotStatus,
    default: ScheduleSlotStatus.PROPOSED,
  })
  status: ScheduleSlotStatus;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'uuid', nullable: true })
  confirmedByUserId?: string;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'boolean', default: false })
  requiresAccess: boolean;

  @Column({ type: 'text', nullable: true })
  accessInstructions?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  contactPhone?: string;

  @Column({ type: 'text', nullable: true })
  specialRequirements?: string;

  // Relations
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.scheduleSlots)
  @JoinColumn({ name: 'workOrderId' })
  workOrder: WorkOrder;
}
