import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { User } from './user.entity';

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  EXPORT = 'EXPORT',
  IMPORT = 'IMPORT',
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  ASSIGN = 'ASSIGN',
  UNASSIGN = 'UNASSIGN',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  SUSPEND = 'SUSPEND',
  RESTORE = 'RESTORE',
  ARCHIVE = 'ARCHIVE',
  PUBLISH = 'PUBLISH',
  UNPUBLISH = 'UNPUBLISH',
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  UPLOAD = 'UPLOAD',
  DOWNLOAD = 'DOWNLOAD',
  SHARE = 'SHARE',
  UNSHARE = 'UNSHARE',
  VOTE = 'VOTE',
  SCHEDULE = 'SCHEDULE',
  RESCHEDULE = 'RESCHEDULE',
  CANCEL = 'CANCEL',
  COMPLETE = 'COMPLETE',
  CUSTOM = 'CUSTOM',
}

export enum AuditEntity {
  ADMINISTRATION = 'ADMINISTRATION',
  USER = 'USER',
  BUILDING = 'BUILDING',
  UNIT = 'UNIT',
  VENDOR = 'VENDOR',
  TICKET = 'TICKET',
  INSPECTION = 'INSPECTION',
  WORK_ORDER = 'WORK_ORDER',
  QUOTE = 'QUOTE',
  INVOICE = 'INVOICE',
  PAYMENT = 'PAYMENT',
  MATERIAL = 'MATERIAL',
  ASSET = 'ASSET',
  MAINTENANCE_PLAN = 'MAINTENANCE_PLAN',
  MAINTENANCE_TASK = 'MAINTENANCE_TASK',
  MEETING = 'MEETING',
  RESOLUTION = 'RESOLUTION',
  VOTE = 'VOTE',
  DOCUMENT = 'DOCUMENT',
  NOTIFICATION = 'NOTIFICATION',
  SUBSCRIPTION = 'SUBSCRIPTION',
  USAGE_METRIC = 'USAGE_METRIC',
  SYSTEM = 'SYSTEM',
}

export enum AuditSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

@Entity('audit_logs')
@Index(['adminId'])
@Index(['actorUserId'])
@Index(['action'])
@Index(['entity'])
@Index(['entityId'])
@Index(['severity'])
@Index(['createdAt'])
@Index(['adminId', 'entity', 'entityId'])
@Index(['adminId', 'actorUserId'])
export class AuditLog extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid', nullable: true })
  actorUserId?: string; // User who performed the action

  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({
    type: 'enum',
    enum: AuditEntity,
  })
  entity: AuditEntity;

  @Column({ type: 'uuid', nullable: true })
  entityId?: string; // ID of the affected entity

  @Column({ type: 'varchar', length: 255, nullable: true })
  entityName?: string; // Human-readable name of the entity

  @Column({ type: 'json', nullable: true })
  diff?: {
    before?: Record<string, any>;
    after?: Record<string, any>;
    changes?: Array<{
      field: string;
      oldValue: any;
      newValue: any;
    }>;
  };

  @Column({ type: 'varchar', length: 45, nullable: true })
  ip?: string; // IP address of the actor

  @Column({ type: 'text', nullable: true })
  userAgent?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  sessionId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string; // Human-readable description of the action

  @Column({
    type: 'enum',
    enum: AuditSeverity,
    default: AuditSeverity.LOW,
  })
  severity: AuditSeverity;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>; // Additional context data

  @Column({ type: 'varchar', length: 255, nullable: true })
  requestId?: string; // Request ID for tracing

  @Column({ type: 'varchar', length: 255, nullable: true })
  correlationId?: string; // Correlation ID for related actions

  @Column({ type: 'varchar', length: 100, nullable: true })
  source?: string; // Source system or module

  @Column({ type: 'varchar', length: 100, nullable: true })
  version?: string; // Application version

  @Column({ type: 'boolean', default: false })
  isSystemAction: boolean; // Whether this was a system-initiated action

  @Column({ type: 'boolean', default: false })
  isAutomated: boolean; // Whether this was an automated action

  @Column({ type: 'varchar', length: 255, nullable: true })
  automationRule?: string; // Rule that triggered the automated action

  @Column({ type: 'boolean', default: false })
  isSensitive: boolean; // Whether this log contains sensitive data

  @Column({ type: 'text', nullable: true })
  errorMessage?: string; // Error message if action failed

  @Column({ type: 'varchar', length: 255, nullable: true })
  errorCode?: string; // Error code if action failed

  @Column({ type: 'int', nullable: true })
  duration?: number; // Duration of the action in milliseconds

  @Column({ type: 'json', nullable: true })
  tags?: string[]; // Tags for categorization and filtering

  @Column({ type: 'timestamp', nullable: true })
  retentionUntil?: Date; // When this log should be deleted

  // Relations
  @ManyToOne(() => Administration)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'actorUserId' })
  actor?: User;
}
