import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Building } from './building.entity';
import { Resolution } from './resolution.entity';

export enum MeetingStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  POSTPONED = 'POSTPONED',
}

export enum MeetingType {
  ORDINARY = 'ORDINARY',
  EXTRAORDINARY = 'EXTRAORDINARY',
  EMERGENCY = 'EMERGENCY',
  BOARD = 'BOARD',
  COMMITTEE = 'COMMITTEE',
}

@Entity('meetings')
@Index(['adminId'])
@Index(['buildingId'])
@Index(['scheduledAt'])
@Index(['status'])
@Index(['type'])
export class Meeting extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  buildingId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  scheduledAt: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string;

  @Column({ type: 'json', nullable: true })
  agenda?: Array<{
    order: number;
    title: string;
    description?: string;
    estimatedDurationMinutes?: number;
    presenter?: string;
  }>;

  @Column({ type: 'json', nullable: true })
  documents?: Array<{
    filename: string;
    url: string;
    description?: string;
    type: string; // agenda, financial_report, etc.
  }>;

  @Column({
    type: 'enum',
    enum: MeetingStatus,
    default: MeetingStatus.SCHEDULED,
  })
  status: MeetingStatus;

  @Column({
    type: 'enum',
    enum: MeetingType,
    default: MeetingType.ORDINARY,
  })
  type: MeetingType;

  @Column({ type: 'text', nullable: true })
  minutes?: string; // Meeting minutes/acta

  @Column({ type: 'timestamp', nullable: true })
  startedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  endedAt?: Date;

  @Column({ type: 'int', nullable: true })
  expectedAttendees?: number;

  @Column({ type: 'int', nullable: true })
  actualAttendees?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  quorumPercentage?: number;

  @Column({ type: 'boolean', default: false })
  quorumReached: boolean;

  @Column({ type: 'uuid', nullable: true })
  chairpersonUserId?: string;

  @Column({ type: 'uuid', nullable: true })
  secretaryUserId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  attendees?: Array<{
    userId?: string;
    unitId?: string;
    name: string;
    role: string;
    present: boolean;
    proxy?: string; // If represented by proxy
    votingWeight?: number;
  }>;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  rescheduledFrom?: Date;

  @Column({ type: 'text', nullable: true })
  rescheduleReason?: string;

  @Column({ type: 'json', nullable: true })
  recordings?: Array<{
    filename: string;
    url: string;
    duration?: number;
    format: string;
  }>;

  // Relations
  @ManyToOne(() => Administration)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @ManyToOne(() => Building)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @OneToMany(() => Resolution, (resolution) => resolution.meeting)
  resolutions: Resolution[];
}
