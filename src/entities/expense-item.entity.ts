import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Expense } from './expense.entity';

export enum ExpenseItemType {
  RECURRING = 'RECURRING', // Gastos recurrentes (empleados, seguros)
  COMMON = 'COMMON', // Gastos comunes (servicios, mantenimiento básico)
  EXTRAORDINARY = 'EXTRAORDINARY', // Gastos extraordinarios (reparaciones de tickets)
  RESERVE = 'RESERVE', // Fondo de reserva
  OTHER = 'OTHER', // Otros gastos
}

export enum ExpenseItemCategory {
  // Gastos recurrentes
  STAFF_SALARIES = 'STAFF_SALARIES', // Sueldos personal
  INSURANCE = 'INSURANCE', // Seguros
  ADMINISTRATION = 'ADMINISTRATION', // Administración

  // Gastos comunes
  UTILITIES = 'UTILITIES', // Servicios públicos (luz, gas, agua)
  CLEANING = 'CLEANING', // Limpieza
  SECURITY = 'SECURITY', // Seguridad
  MAINTENANCE = 'MAINTENANCE', // Mantenimiento preventivo
  SUPPLIES = 'SUPPLIES', // Insumos

  // Gastos extraordinarios
  REPAIRS = 'REPAIRS', // Reparaciones
  IMPROVEMENTS = 'IMPROVEMENTS', // Mejoras
  EMERGENCY = 'EMERGENCY', // Emergencias

  // Otros
  LEGAL = 'LEGAL', // Gastos legales
  TAXES = 'TAXES', // Impuestos
  RESERVE_FUND = 'RESERVE_FUND', // Fondo de reserva
  OTHER = 'OTHER', // Otros
}

@Entity('expense_items')
@Index(['expenseId'])
@Index(['type'])
@Index(['category'])
export class ExpenseItem extends BaseEntity {
  @Column({ type: 'uuid' })
  expenseId: string;

  @Column({ type: 'varchar', length: 255 })
  description: string;

  @Column({
    type: 'enum',
    enum: ExpenseItemType,
  })
  type: ExpenseItemType;

  @Column({
    type: 'enum',
    enum: ExpenseItemCategory,
  })
  category: ExpenseItemCategory;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  unitPrice?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'uuid', nullable: true })
  relatedWorkOrderId?: string; // Para gastos extraordinarios de tickets

  @Column({ type: 'uuid', nullable: true })
  relatedVendorInvoiceId?: string; // Referencia a factura de proveedor

  @Column({ type: 'date', nullable: true })
  serviceDate?: Date; // Fecha del servicio/gasto

  @Column({ type: 'json', nullable: true })
  metadata?: {
    invoiceNumber?: string;
    vendorName?: string;
    approvedByUserId?: string;
    attachments?: Array<{
      filename: string;
      url: string;
      type: string;
    }>;
  };

  // Relations
  @ManyToOne(() => Expense, (expense) => expense.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'expenseId' })
  expense: Expense;
}
