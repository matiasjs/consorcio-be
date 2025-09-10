import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Resolution } from './resolution.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';

export enum VoteChoice {
  FOR = 'FOR',
  AGAINST = 'AGAINST',
  ABSTAIN = 'ABSTAIN',
}

export enum VoteType {
  DIRECT = 'DIRECT',
  PROXY = 'PROXY',
  ELECTRONIC = 'ELECTRONIC',
}

@Entity('votes')
@Index(['resolutionId'])
@Index(['unitId'])
@Index(['voterUserId'])
@Index(['choice'])
@Index(['resolutionId', 'unitId'], { unique: true }) // One vote per unit per resolution
export class Vote extends BaseEntity {
  @Column({ type: 'uuid' })
  resolutionId: string;

  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'uuid', nullable: true })
  voterUserId?: string; // Who cast the vote (could be proxy)

  @Column({
    type: 'enum',
    enum: VoteChoice,
  })
  choice: VoteChoice;

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  weight: number; // Voting weight based on unit ownership percentage

  @Column({
    type: 'enum',
    enum: VoteType,
    default: VoteType.DIRECT,
  })
  type: VoteType;

  @Column({ type: 'uuid', nullable: true })
  proxyFromUserId?: string; // If vote is by proxy, who gave the proxy

  @Column({ type: 'text', nullable: true })
  proxyDocument?: string; // Reference to proxy authorization

  @Column({ type: 'text', nullable: true })
  comments?: string;

  @Column({ type: 'timestamp', nullable: true })
  votedAt?: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  ipAddress?: string; // For electronic votes

  @Column({ type: 'text', nullable: true })
  userAgent?: string; // For electronic votes

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  verifiedByUserId?: string;

  @Column({ type: 'text', nullable: true })
  verificationNotes?: string;

  @Column({ type: 'boolean', default: false })
  isContested: boolean;

  @Column({ type: 'text', nullable: true })
  contestReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  contestedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  contestedByUserId?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Additional data for electronic voting systems

  // Relations
  @ManyToOne(() => Resolution, (resolution) => resolution.votes)
  @JoinColumn({ name: 'resolutionId' })
  resolution: Resolution;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unitId' })
  unit: Unit;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'voterUserId' })
  voter?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'proxyFromUserId' })
  proxyFromUser?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'verifiedByUserId' })
  verifiedByUser?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'contestedByUserId' })
  contestedByUser?: User;
}
