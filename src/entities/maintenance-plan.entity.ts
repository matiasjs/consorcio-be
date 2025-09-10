import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Asset } from './asset.entity';
import { MaintenanceTask } from './maintenance-task.entity';

export enum MaintenanceFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  SEMIANNUAL = 'SEMIANNUAL',
  ANNUAL = 'ANNUAL',
  BIANNUAL = 'BIANNUAL',
  CUSTOM = 'CUSTOM',
}

export enum PlanStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  COMPLETED = 'COMPLETED',
}

@Entity('maintenance_plans')
@Index(['assetId'])
@Index(['frequency'])
@Index(['status'])
@Index(['nextDueDate'])
export class MaintenancePlan extends BaseEntity {
  @Column({ type: 'uuid' })
  assetId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: MaintenanceFrequency,
  })
  frequency: MaintenanceFrequency;

  @Column({ type: 'int', nullable: true })
  customFrequencyDays?: number; // For CUSTOM frequency

  @Column({ type: 'json' })
  taskList: Array<{
    name: string;
    description: string;
    estimatedDurationMinutes?: number;
    requiredTools?: string[];
    requiredMaterials?: string[];
    safetyRequirements?: string[];
    instructions?: string;
  }>;

  @Column({ type: 'int', nullable: true })
  slaHours?: number; // Service Level Agreement in hours

  @Column({
    type: 'enum',
    enum: PlanStatus,
    default: PlanStatus.ACTIVE,
  })
  status: PlanStatus;

  @Column({ type: 'date', nullable: true })
  startDate?: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'date', nullable: true })
  nextDueDate?: Date;

  @Column({ type: 'date', nullable: true })
  lastCompletedDate?: Date;

  @Column({ type: 'int', default: 0 })
  completedCount: number;

  @Column({ type: 'int', default: 0 })
  overdueCount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'uuid', nullable: true })
  assignedVendorId?: string;

  @Column({ type: 'uuid', nullable: true })
  assignedUserId?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: false })
  requiresShutdown: boolean;

  @Column({ type: 'text', nullable: true })
  shutdownInstructions?: string;

  @Column({ type: 'boolean', default: false })
  requiresSpecialAccess: boolean;

  @Column({ type: 'text', nullable: true })
  accessInstructions?: string;

  @Column({ type: 'json', nullable: true })
  documents?: Array<{
    filename: string;
    url: string;
    description?: string;
  }>;

  // Relations
  @ManyToOne(() => Asset, (asset) => asset.maintenancePlans)
  @JoinColumn({ name: 'assetId' })
  asset: Asset;

  @OneToMany(() => MaintenanceTask, (task) => task.plan)
  tasks: MaintenanceTask[];
}
