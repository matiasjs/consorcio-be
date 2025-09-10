import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Subscription } from './subscription.entity';

export enum MetricType {
  UNITS_COUNT = 'UNITS_COUNT',
  USERS_COUNT = 'USERS_COUNT',
  TICKETS_COUNT = 'TICKETS_COUNT',
  STORAGE_USED = 'STORAGE_USED',
  API_CALLS = 'API_CALLS',
  NOTIFICATIONS_SENT = 'NOTIFICATIONS_SENT',
  DOCUMENTS_UPLOADED = 'DOCUMENTS_UPLOADED',
  MEETINGS_CREATED = 'MEETINGS_CREATED',
  WORK_ORDERS_CREATED = 'WORK_ORDERS_CREATED',
  INVOICES_PROCESSED = 'INVOICES_PROCESSED',
  ACTIVE_SESSIONS = 'ACTIVE_SESSIONS',
  BANDWIDTH_USED = 'BANDWIDTH_USED',
  CUSTOM = 'CUSTOM',
}

export enum MetricPeriod {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  ANNUAL = 'ANNUAL',
}

@Entity('usage_metrics')
@Index(['adminId'])
@Index(['subscriptionId'])
@Index(['metric'])
@Index(['period'])
@Index(['periodStart'])
@Index(['periodEnd'])
export class UsageMetric extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid', nullable: true })
  subscriptionId?: string;

  @Column({
    type: 'enum',
    enum: MetricType,
  })
  metric: MetricType;

  @Column({
    type: 'enum',
    enum: MetricPeriod,
  })
  period: MetricPeriod;

  @Column({ type: 'date' })
  periodStart: Date;

  @Column({ type: 'date' })
  periodEnd: Date;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  value: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  unit?: string; // bytes, count, etc.

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  limit?: number; // Limit for this metric if applicable

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  usagePercentage?: number; // Percentage of limit used

  @Column({ type: 'boolean', default: false })
  isOverLimit: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  previousValue?: number; // Value from previous period

  @Column({ type: 'decimal', precision: 10, scale: 4, nullable: true })
  changePercentage?: number; // Percentage change from previous period

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  peakValue?: number; // Peak value during the period

  @Column({ type: 'timestamp', nullable: true })
  peakValueAt?: Date;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  averageValue?: number; // Average value during the period

  @Column({ type: 'json', nullable: true })
  breakdown?: Record<string, number>; // Detailed breakdown of the metric

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Additional metric-specific data

  @Column({ type: 'boolean', default: false })
  isEstimated: boolean; // Whether this is an estimated value

  @Column({ type: 'timestamp', nullable: true })
  calculatedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  calculationMethod?: string;

  @Column({ type: 'boolean', default: false })
  isAggregated: boolean; // Whether this metric is aggregated from smaller periods

  @Column({ type: 'json', nullable: true })
  sourceMetricIds?: string[]; // IDs of metrics used to calculate this one

  // Relations
  @ManyToOne(() => Administration)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @ManyToOne(() => Subscription)
  @JoinColumn({ name: 'subscriptionId' })
  subscription?: Subscription;
}
