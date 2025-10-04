import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
  Unique,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { ExpenseItem } from './expense-item.entity';
import { ExpenseDistribution } from './expense-distribution.entity';

export enum ExpenseStatus {
  DRAFT = 'DRAFT',
  GENERATED = 'GENERATED',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
}

export enum ExpenseDistributionMethod {
  EQUAL = 'EQUAL', // Partes iguales
  BY_OWNERSHIP = 'BY_OWNERSHIP', // Por porcentaje de propiedad
  BY_M2 = 'BY_M2', // Por metros cuadrados
  CUSTOM = 'CUSTOM', // Distribución personalizada
}

@Entity('expenses')
@Index(['adminId'])
@Index(['buildingId'])
@Index(['period'])
@Index(['status'])
@Unique(['buildingId', 'period']) // Una expensa por edificio por período
export class Expense extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'uuid' })
  buildingId: string;

  @Column({ type: 'varchar', length: 7 }) // Format: YYYY-MM
  period: string;

  @Column({ type: 'varchar', length: 100 })
  title: string; // e.g., "Expensas Enero 2024"

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalAmount: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.DRAFT,
  })
  status: ExpenseStatus;

  @Column({
    type: 'enum',
    enum: ExpenseDistributionMethod,
    default: ExpenseDistributionMethod.EQUAL,
  })
  distributionMethod: ExpenseDistributionMethod;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'date', nullable: true })
  generatedAt?: Date;

  @Column({ type: 'date', nullable: true })
  sentAt?: Date;

  @Column({ type: 'json', nullable: true })
  metadata?: {
    totalUnits?: number;
    activeUnits?: number;
    totalM2?: number;
    averageAmountPerUnit?: number;
    generatedByUserId?: string;
    notes?: string;
  };

  // Relations
  @ManyToOne(() => Building, (building) => building.id)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @OneToMany(() => ExpenseItem, (item) => item.expense, { cascade: true })
  items: ExpenseItem[];

  @OneToMany(
    () => ExpenseDistribution,
    (distribution) => distribution.expense,
    {
      cascade: true,
    },
  )
  distributions: ExpenseDistribution[];
}
