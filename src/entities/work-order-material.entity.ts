import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkOrder } from './work-order.entity';
import { MaterialItem } from './material-item.entity';

@Entity('work_order_materials')
@Index(['workOrderId'])
@Index(['materialItemId'])
export class WorkOrderMaterial extends BaseEntity {
  @Column({ type: 'uuid' })
  workOrderId: string;

  @Column({ type: 'uuid' })
  materialItemId: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  qty: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  unitCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplierName?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'decimal', precision: 10, scale: 3, nullable: true })
  actualQtyUsed?: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  actualCost?: number;

  @Column({ type: 'boolean', default: false })
  isSuppliedByVendor: boolean;

  @Column({ type: 'boolean', default: false })
  isSuppliedByClient: boolean;

  @Column({ type: 'date', nullable: true })
  deliveryDate?: Date;

  @Column({ type: 'text', nullable: true })
  deliveryNotes?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  invoiceReference?: string;

  // Relations
  @ManyToOne(() => WorkOrder, (workOrder) => workOrder.materials)
  @JoinColumn({ name: 'workOrderId' })
  workOrder: WorkOrder;

  @ManyToOne(() => MaterialItem, (materialItem) => materialItem.workOrderMaterials)
  @JoinColumn({ name: 'materialItemId' })
  materialItem: MaterialItem;
}
