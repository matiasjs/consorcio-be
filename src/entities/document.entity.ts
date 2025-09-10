import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { Building } from './building.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';

export enum DocumentType {
  BYLAW = 'BYLAW',
  REGULATION = 'REGULATION',
  FINANCIAL_REPORT = 'FINANCIAL_REPORT',
  MEETING_MINUTES = 'MEETING_MINUTES',
  INSURANCE = 'INSURANCE',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  RECEIPT = 'RECEIPT',
  CERTIFICATE = 'CERTIFICATE',
  PERMIT = 'PERMIT',
  MANUAL = 'MANUAL',
  WARRANTY = 'WARRANTY',
  PHOTO = 'PHOTO',
  PLAN = 'PLAN',
  LEGAL = 'LEGAL',
  OTHER = 'OTHER',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  EXPIRED = 'EXPIRED',
  SUPERSEDED = 'SUPERSEDED',
}

@Entity('documents')
@Index(['adminId'])
@Index(['buildingId'])
@Index(['unitId'])
@Index(['type'])
@Index(['status'])
@Index(['uploadedByUserId'])
export class Document extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid', nullable: true })
  buildingId?: string;

  @Column({ type: 'uuid', nullable: true })
  unitId?: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 500 })
  fileUrl: string;

  @Column({ type: 'varchar', length: 255 })
  filename: string;

  @Column({ type: 'varchar', length: 100 })
  mimeType: string;

  @Column({ type: 'bigint' })
  fileSize: number; // in bytes

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;

  @Column({ type: 'uuid' })
  uploadedByUserId: string;

  @Column({ type: 'timestamp', nullable: true })
  uploadedAt?: Date;

  @Column({ type: 'date', nullable: true })
  effectiveDate?: Date;

  @Column({ type: 'date', nullable: true })
  expiryDate?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  version?: string;

  @Column({ type: 'uuid', nullable: true })
  supersededByDocumentId?: string;

  @Column({ type: 'uuid', nullable: true })
  supersedesDocumentId?: string;

  @Column({ type: 'json', nullable: true })
  tags?: string[];

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  isPublic: boolean; // Visible to all building residents

  @Column({ type: 'boolean', default: false })
  requiresSignature: boolean;

  @Column({ type: 'json', nullable: true })
  signatures?: Array<{
    userId: string;
    signedAt: Date;
    ipAddress?: string;
    digitalSignature?: string;
  }>;

  @Column({ type: 'boolean', default: false })
  isEncrypted: boolean;

  @Column({ type: 'varchar', length: 255, nullable: true })
  encryptionKey?: string;

  @Column({ type: 'int', default: 0 })
  downloadCount: number;

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt?: Date;

  @Column({ type: 'uuid', nullable: true })
  lastAccessedByUserId?: string;

  @Column({ type: 'json', nullable: true })
  accessLog?: Array<{
    userId: string;
    accessedAt: Date;
    action: string; // view, download, etc.
    ipAddress?: string;
  }>;

  @Column({ type: 'text', nullable: true })
  checksum?: string; // For file integrity verification

  // Relations
  @ManyToOne(() => Administration)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @ManyToOne(() => Building)
  @JoinColumn({ name: 'buildingId' })
  building?: Building;

  @ManyToOne(() => Unit)
  @JoinColumn({ name: 'unitId' })
  unit?: Unit;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploadedByUserId' })
  uploadedByUser: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'lastAccessedByUserId' })
  lastAccessedByUser?: User;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'supersededByDocumentId' })
  supersededByDocument?: Document;

  @ManyToOne(() => Document)
  @JoinColumn({ name: 'supersedesDocumentId' })
  supersedesDocument?: Document;
}
