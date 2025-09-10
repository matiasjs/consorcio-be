import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Ticket } from './ticket.entity';
import { User } from './user.entity';

export enum MessageDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  INTERNAL = 'INTERNAL',
}

export enum MessageChannel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  SMS = 'SMS',
  PHONE = 'PHONE',
  SYSTEM = 'SYSTEM',
}

export enum EntityType {
  TICKET = 'TICKET',
  WORK_ORDER = 'WORK_ORDER',
  INSPECTION = 'INSPECTION',
  MEETING = 'MEETING',
  BUILDING = 'BUILDING',
  UNIT = 'UNIT',
}

@Entity('messages')
@Index(['entityType', 'entityId'])
@Index(['authorUserId'])
@Index(['direction'])
@Index(['channel'])
export class Message extends BaseEntity {
  @Column({
    type: 'enum',
    enum: EntityType,
  })
  entityType: EntityType;

  @Column({ type: 'uuid' })
  entityId: string;

  @Column({ type: 'uuid', nullable: true })
  authorUserId?: string;

  @Column({
    type: 'enum',
    enum: MessageDirection,
  })
  direction: MessageDirection;

  @Column({
    type: 'enum',
    enum: MessageChannel,
  })
  channel: MessageChannel;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'json', nullable: true })
  attachments?: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number;
  }>;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true })
  readAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  readByUserId?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  fromEmail?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  toEmail?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  fromPhone?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  toPhone?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  externalId?: string; // For external system integration

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'authorUserId' })
  author?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'readByUserId' })
  readByUser?: User;

  // Virtual relation to ticket (when entityType is TICKET)
  @ManyToOne(() => Ticket, (ticket) => ticket.messages)
  @JoinColumn({ name: 'entityId' })
  ticket?: Ticket;
}
