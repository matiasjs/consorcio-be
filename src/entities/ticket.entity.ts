import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Building } from './building.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';
import { Inspection } from './inspection.entity';
import { WorkOrder } from './work-order.entity';
import { Message } from './message.entity';

export enum TicketType {
  MAINTENANCE = 'MAINTENANCE',
  REPAIR = 'REPAIR',
  COMPLAINT = 'COMPLAINT',
  EMERGENCY = 'EMERGENCY',
  CLEANING = 'CLEANING',
  SECURITY = 'SECURITY',
  OTHER = 'OTHER',
}

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_INSPECTION = 'PENDING_INSPECTION',
  PENDING_QUOTE = 'PENDING_QUOTE',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
  EMERGENCY = 'EMERGENCY',
}

export enum TicketChannel {
  WEB = 'WEB',
  MOBILE = 'MOBILE',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  IN_PERSON = 'IN_PERSON',
}

@Entity('tickets')
@Index(['adminId'])
@Index(['buildingId'])
@Index(['unitId'])
@Index(['createdByUserId'])
@Index(['status'])
@Index(['priority'])
@Index(['type'])
export class Ticket extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  buildingId: string;

  @Column({ type: 'uuid', nullable: true })
  unitId?: string;

  @Column({ type: 'uuid' })
  createdByUserId: string;

  @Column({
    type: 'enum',
    enum: TicketType,
  })
  type: TicketType;

  @Column({
    type: 'enum',
    enum: TicketChannel,
    default: TicketChannel.WEB,
  })
  channel: TicketChannel;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({ type: 'json', nullable: true })
  attachments?: Array<{
    filename: string;
    url: string;
    mimeType: string;
    size: number;
  }>;

  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @Column({ type: 'timestamp', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  resolvedByUserId?: string;

  @Column({ type: 'timestamp', nullable: true })
  dueDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  // Relations
  @ManyToOne(() => Administration)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @ManyToOne(() => Building)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unitId' })
  unit?: Unit;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdByUserId' })
  createdByUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'resolvedByUserId' })
  resolvedByUser?: User;

  @OneToMany(() => Inspection, (inspection) => inspection.ticket)
  inspections: Inspection[];

  @OneToMany(() => WorkOrder, (workOrder) => workOrder.ticket)
  workOrders: WorkOrder[];

  @OneToMany(() => Message, (message) => message.ticket)
  messages: Message[];
}
