import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { MaintenancePlan } from './maintenance-plan.entity';
import { Vendor } from './vendor.entity';

export enum AssetType {
  ELEVATOR = 'ELEVATOR',
  HVAC = 'HVAC',
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  FIRE_SAFETY = 'FIRE_SAFETY',
  SECURITY = 'SECURITY',
  LIGHTING = 'LIGHTING',
  GENERATOR = 'GENERATOR',
  PUMP = 'PUMP',
  BOILER = 'BOILER',
  INTERCOM = 'INTERCOM',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  CCTV = 'CCTV',
  ALARM = 'ALARM',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  OUT_OF_ORDER = 'OUT_OF_ORDER',
  RETIRED = 'RETIRED',
}

@Entity('assets')
@Index(['adminId'])
@Index(['buildingId'])
@Index(['type'])
@Index(['status'])
@Index(['vendorId'])
export class Asset extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  buildingId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({
    type: 'enum',
    enum: AssetType,
  })
  type: AssetType;

  @Column({ type: 'varchar', length: 255, nullable: true })
  serial?: string;

  @Column({ type: 'date', nullable: true })
  installDate?: Date;

  @Column({ type: 'uuid', nullable: true })
  vendorId?: string; // Preferred maintenance vendor

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  manufacturer?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  location?: string; // Location within building

  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  purchasePrice?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'date', nullable: true })
  warrantyExpiry?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  warrantyProvider?: string;

  @Column({
    type: 'enum',
    enum: AssetStatus,
    default: AssetStatus.ACTIVE,
  })
  status: AssetStatus;

  @Column({ type: 'int', nullable: true })
  expectedLifeYears?: number;

  @Column({ type: 'date', nullable: true })
  lastMaintenanceDate?: Date;

  @Column({ type: 'date', nullable: true })
  nextMaintenanceDate?: Date;

  @Column({ type: 'json', nullable: true })
  documents?: Array<{
    filename: string;
    url: string;
    type: string; // manual, warranty, certificate, etc.
    description?: string;
  }>;

  @Column({ type: 'json', nullable: true })
  photos?: Array<{
    filename: string;
    url: string;
    description?: string;
    timestamp: Date;
  }>;

  @Column({ type: 'text', nullable: true })
  maintenanceInstructions?: string;

  @Column({ type: 'text', nullable: true })
  safetyNotes?: string;

  // Relations
  @ManyToOne(() => Building)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @ManyToOne(() => Vendor)
  @JoinColumn({ name: 'vendorId' })
  preferredVendor?: Vendor;

  @OneToMany(() => MaintenancePlan, (plan) => plan.asset)
  maintenancePlans: MaintenancePlan[];
}
