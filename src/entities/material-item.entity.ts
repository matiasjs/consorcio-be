import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { WorkOrderMaterial } from './work-order-material.entity';

export enum MaterialUnit {
  PIECE = 'PIECE',
  METER = 'METER',
  SQUARE_METER = 'SQUARE_METER',
  CUBIC_METER = 'CUBIC_METER',
  KILOGRAM = 'KILOGRAM',
  LITER = 'LITER',
  HOUR = 'HOUR',
  DAY = 'DAY',
  PACKAGE = 'PACKAGE',
  BOX = 'BOX',
  ROLL = 'ROLL',
  TUBE = 'TUBE',
  BAG = 'BAG',
}

export enum MaterialCategory {
  PLUMBING = 'PLUMBING',
  ELECTRICAL = 'ELECTRICAL',
  PAINTING = 'PAINTING',
  CONSTRUCTION = 'CONSTRUCTION',
  HARDWARE = 'HARDWARE',
  CLEANING = 'CLEANING',
  SAFETY = 'SAFETY',
  TOOLS = 'TOOLS',
  LABOR = 'LABOR',
  OTHER = 'OTHER',
}

@Entity('material_items')
@Index(['name'])
@Index(['sku'])
@Index(['category'])
export class MaterialItem extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, nullable: true, unique: true })
  sku?: string;

  @Column({
    type: 'enum',
    enum: MaterialUnit,
  })
  unit: MaterialUnit;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  defaultCost?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({
    type: 'enum',
    enum: MaterialCategory,
    default: MaterialCategory.OTHER,
  })
  category: MaterialCategory;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  brand?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  model?: string;

  @Column({ type: 'text', nullable: true })
  specifications?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplier?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  supplierCode?: string;

  @Column({ type: 'int', nullable: true })
  minimumStock?: number;

  @Column({ type: 'int', nullable: true })
  currentStock?: number;

  @Column({ type: 'decimal', precision: 8, scale: 3, nullable: true })
  weight?: number; // in kg

  @Column({ type: 'json', nullable: true })
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
    unit: string;
  };

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Relations
  @OneToMany(() => WorkOrderMaterial, (workOrderMaterial) => workOrderMaterial.materialItem)
  workOrderMaterials: WorkOrderMaterial[];
}
