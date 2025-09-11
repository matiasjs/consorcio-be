import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Meeting } from './meeting.entity';
import { Vote } from './vote.entity';

export enum ResolutionStatus {
  DRAFT = 'DRAFT',
  PROPOSED = 'PROPOSED',
  VOTING = 'VOTING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
  DEFERRED = 'DEFERRED',
}

export enum ResolutionType {
  ORDINARY = 'ORDINARY',
  SPECIAL = 'SPECIAL',
  FINANCIAL = 'FINANCIAL',
  ADMINISTRATIVE = 'ADMINISTRATIVE',
  MAINTENANCE = 'MAINTENANCE',
  BYLAW_CHANGE = 'BYLAW_CHANGE',
}

@Entity('resolutions')
@Index(['meetingId'])
@Index(['status'])
@Index(['type'])
@Index(['requiresVote'])
export class Resolution extends BaseEntity {
  @Column({ type: 'uuid' })
  meetingId: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'boolean', default: true })
  requiresVote: boolean;

  @Column({
    type: 'enum',
    enum: ResolutionStatus,
    default: ResolutionStatus.DRAFT,
  })
  status: ResolutionStatus;

  @Column({
    type: 'enum',
    enum: ResolutionType,
    default: ResolutionType.ORDINARY,
  })
  type: ResolutionType;

  @Column({ type: 'int', nullable: true })
  orderInMeeting?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  requiredMajority?: number; // Percentage required to pass

  @Column({ type: 'timestamp', nullable: true })
  votingStartedAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  votingEndedAt?: Date;

  @Column({ type: 'int', default: 0 })
  votesFor: number;

  @Column({ type: 'int', default: 0 })
  votesAgainst: number;

  @Column({ type: 'int', default: 0 })
  votesAbstain: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
  totalVotingWeight: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
  weightFor: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
  weightAgainst: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, default: 0 })
  weightAbstain: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  approvalPercentage?: number;

  @Column({ type: 'text', nullable: true })
  rationale?: string; // Reasoning behind the resolution

  @Column({ type: 'text', nullable: true })
  financialImpact?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'date', nullable: true })
  implementationDate?: Date;

  @Column({ type: 'text', nullable: true })
  implementationNotes?: string;

  @Column({ type: 'uuid', nullable: true })
  proposedByUserId?: string;

  @Column({ type: 'timestamp', nullable: true })
  proposedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @Column({ type: 'text', nullable: true })
  withdrawalReason?: string;

  @Column({ type: 'json', nullable: true })
  attachments?: Array<{
    filename: string;
    url: string;
    description?: string;
  }>;

  @Column({ type: 'text', nullable: true })
  legalReferences?: string;

  @Column({ type: 'boolean', default: false })
  requiresUnanimity: boolean;

  @Column({ type: 'boolean', default: false })
  isUrgent: boolean;

  @Column({ type: 'text', nullable: true })
  urgencyReason?: string;

  // Relations
  @ManyToOne(() => Meeting, (meeting) => meeting.resolutions)
  @JoinColumn({ name: 'meetingId' })
  meeting: Meeting;

  @OneToMany(() => Vote, (vote) => vote.resolution)
  votes: Vote[];
}
