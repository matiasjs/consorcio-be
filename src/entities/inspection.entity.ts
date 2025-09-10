import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

export enum InspectionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  RESCHEDULED = 'RESCHEDULED',
}

export enum InspectionRecommendation {
  NO_ACTION = 'NO_ACTION',
  MINOR_REPAIR = 'MINOR_REPAIR',
  MAJOR_REPAIR = 'MAJOR_REPAIR',
  REPLACEMENT = 'REPLACEMENT',
  EMERGENCY_ACTION = 'EMERGENCY_ACTION',
  FURTHER_INSPECTION = 'FURTHER_INSPECTION',
}

@Entity('inspections')
@Index(['adminId'])
@Index(['ticketId'])
@Index(['inspectorUserId'])
@Index(['scheduledAt'])
@Index(['status'])
export class Inspection extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  ticketId: string;

  @Column({ type: 'uuid' })
  inspectorUserId: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  visitedAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  photos?: Array<{
    filename: string;
    url: string;
    description?: string;
    timestamp: Date;
  }>;

  @Column({
    type: 'enum',
    enum: InspectionRecommendation,
    nullable: true,
  })
  recommendation?: InspectionRecommendation;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.SCHEDULED,
  })
  status: InspectionStatus;

  @Column({ type: 'text', nullable: true })
  findings?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedRepairCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'int', nullable: true })
  estimatedDurationHours?: number;

  @Column({ type: 'boolean', default: false })
  requiresSpecialist: boolean;

  @Column({ type: 'text', nullable: true })
  specialistType?: string;

  @Column({ type: 'boolean', default: false })
  safetyRisk: boolean;

  @Column({ type: 'text', nullable: true })
  safetyNotes?: string;

  // Relations
  @ManyToOne(() => Ticket, (ticket) => ticket.inspections)
  @JoinColumn({ name: 'ticketId' })
  ticket: Ticket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inspectorUserId' })
  inspector: User;
}
