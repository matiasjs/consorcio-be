import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { UsageMetric } from './usage-metric.entity';

export enum SubscriptionPlan {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
  PENDING_PAYMENT = 'PENDING_PAYMENT',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
}

@Entity('subscriptions')
@Index(['adminId'])
@Index(['plan'])
@Index(['status'])
@Index(['renewsAt'])
@Index(['expiresAt'])
export class Subscription extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({
    type: 'enum',
    enum: SubscriptionPlan,
  })
  plan: SubscriptionPlan;

  @Column({ type: 'int' })
  unitsQuota: number; // Maximum number of units allowed

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  priceMonth: number; // Monthly price

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'timestamp' })
  renewsAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.ACTIVE,
  })
  status: SubscriptionStatus;

  @Column({
    type: 'enum',
    enum: BillingCycle,
    default: BillingCycle.MONTHLY,
  })
  billingCycle: BillingCycle;

  @Column({ type: 'date', nullable: true })
  trialStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  trialEndDate?: Date;

  @Column({ type: 'boolean', default: false })
  isTrialUsed: boolean;

  @Column({ type: 'json', nullable: true })
  features?: Array<{
    name: string;
    enabled: boolean;
    limit?: number;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  discountAmount?: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  discountPercentage?: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  discountCode?: string;

  @Column({ type: 'date', nullable: true })
  discountExpiresAt?: Date;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethodId?: string; // External payment method reference

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalSubscriptionId?: string; // External billing system ID

  @Column({ type: 'timestamp', nullable: true })
  lastBilledAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextBillingAt?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPaid: number;

  @Column({ type: 'int', default: 0 })
  billingCycleCount: number;

  @Column({ type: 'boolean', default: true })
  autoRenew: boolean;

  @Column({ type: 'text', nullable: true })
  cancellationReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  cancelledByUserId?: string;

  @Column({ type: 'text', nullable: true })
  suspensionReason?: string;

  @Column({ type: 'timestamp', nullable: true })
  suspendedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  suspendedByUserId?: string;

  // Relations
  @ManyToOne(() => Administration)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @OneToMany(() => UsageMetric, (metric) => metric.subscription)
  usageMetrics: UsageMetric[];
}
