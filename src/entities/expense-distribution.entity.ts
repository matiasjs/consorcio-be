import { Entity, Column, ManyToOne, JoinColumn, Index, Unique } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Expense } from './expense.entity';
import { Unit } from './unit.entity';

export enum ExpenseDistributionStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  PARTIAL = 'PARTIAL',
  CANCELLED = 'CANCELLED',
}

@Entity('expense_distributions')
@Index(['expenseId'])
@Index(['unitId'])
@Index(['status'])
@Unique(['expenseId', 'unitId']) // Una distribución por expensa por unidad
export class ExpenseDistribution extends BaseEntity {
  @Column({ type: 'uuid' })
  expenseId: string;

  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'varchar', length: 50 })
  unitLabel: string; // Denormalizado para performance

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  distributionPercentage?: number; // % del total que corresponde a esta unidad

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  unitM2?: number; // M2 de la unidad (denormalizado)

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ownershipPercentage?: number; // % de propiedad (denormalizado)

  @Column({
    type: 'enum',
    enum: ExpenseDistributionStatus,
    default: ExpenseDistributionStatus.PENDING,
  })
  status: ExpenseDistributionStatus;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  paidAmount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  remainingAmount: number;

  @Column({ type: 'date', nullable: true })
  dueDate?: Date;

  @Column({ type: 'date', nullable: true })
  paidAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentReference?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'json', nullable: true })
  ownerInfo?: {
    ownerUserId?: string;
    ownerName?: string;
    ownerEmail?: string;
    ownerPhone?: string;
  };

  @Column({ type: 'json', nullable: true })
  tenantInfo?: {
    tenantUserId?: string;
    tenantName?: string;
    tenantEmail?: string;
    tenantPhone?: string;
  };

  @Column({ type: 'json', nullable: true })
  paymentHistory?: Array<{
    amount: number;
    date: Date;
    method: string;
    reference?: string;
    notes?: string;
  }>;

  // Relations
  @ManyToOne(() => Expense, (expense) => expense.distributions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;

  @ManyToOne(() => Unit, (unit) => unit.id)
  @JoinColumn({ name: 'unitId' })
  unit: Unit;
}
