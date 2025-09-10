import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

export enum NotificationChannel {
  WEB = 'WEB',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',
  PUSH = 'PUSH',
  IN_APP = 'IN_APP',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

export enum NotificationType {
  TICKET_CREATED = 'TICKET_CREATED',
  TICKET_UPDATED = 'TICKET_UPDATED',
  TICKET_COMPLETED = 'TICKET_COMPLETED',
  INSPECTION_SCHEDULED = 'INSPECTION_SCHEDULED',
  WORK_ORDER_ASSIGNED = 'WORK_ORDER_ASSIGNED',
  PAYMENT_DUE = 'PAYMENT_DUE',
  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  MEETING_REMINDER = 'MEETING_REMINDER',
  VOTE_REQUIRED = 'VOTE_REQUIRED',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  DOCUMENT_SHARED = 'DOCUMENT_SHARED',
  EMERGENCY = 'EMERGENCY',
  GENERAL = 'GENERAL',
  SYSTEM = 'SYSTEM',
}

export enum NotificationPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY',
}

@Entity('notifications')
@Index(['userId'])
@Index(['adminId'])
@Index(['channel'])
@Index(['status'])
@Index(['type'])
@Index(['priority'])
@Index(['scheduledFor'])
export class Notification extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  targetUserId?: string;

  @Column({ type: 'uuid', nullable: true })
  targetBuildingId?: string;

  @Column({ type: 'uuid', nullable: true })
  sentByUserId?: string;

  @Column({ type: 'uuid', nullable: true })
  relatedEntityId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  relatedEntityType?: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'boolean', default: false })
  isHighPriority: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  message?: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  body: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
  })
  channel: NotificationChannel;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.PENDING,
  })
  status: NotificationStatus;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({ type: 'timestamp', nullable: true })
  scheduledFor?: Date;

  @Column({ type: 'timestamp', nullable: true })
  sentAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date;

  @Column({ type: 'json', nullable: true })
  data?: Record<string, any>; // Additional data for the notification

  @Column({ type: 'varchar', length: 500, nullable: true })
  actionUrl?: string; // URL to navigate when notification is clicked

  @Column({ type: 'varchar', length: 255, nullable: true })
  actionText?: string; // Text for action button

  @Column({ type: 'varchar', length: 255, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  iconUrl?: string;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Channel-specific metadata

  @Column({ type: 'text', nullable: true })
  failureReason?: string;

  @Column({ type: 'int', default: 0 })
  retryCount: number;

  @Column({ type: 'int', default: 3 })
  maxRetries: number;

  @Column({ type: 'timestamp', nullable: true })
  nextRetryAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId?: string; // ID from external notification service

  @Column({ type: 'varchar', length: 255, nullable: true })
  templateId?: string; // Template used for this notification

  @Column({ type: 'json', nullable: true })
  templateData?: Record<string, any>; // Data used to populate template

  @Column({ type: 'boolean', default: false })
  isGrouped: boolean; // Part of a grouped notification

  @Column({ type: 'varchar', length: 255, nullable: true })
  groupId?: string; // Group identifier for related notifications

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityType?: string; // Type of entity this notification relates to

  @Column({ type: 'uuid', nullable: true })
  entityId?: string; // ID of entity this notification relates to

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
