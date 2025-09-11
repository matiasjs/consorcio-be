import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Building } from './building.entity';
import { UnitOccupancy } from './unit-occupancy.entity';

export enum UnitType {
  APARTMENT = 'APARTMENT',
  STORE = 'STORE',
  GARAGE = 'GARAGE',
  STORAGE = 'STORAGE',
  OFFICE = 'OFFICE',
}

@Entity('units')
@Index(['buildingId'])
@Index(['buildingId', 'label'], { unique: true })
export class Unit extends BaseEntity {
  @Column({ type: 'uuid' })
  buildingId: string;

  @Column({ type: 'varchar', length: 50 })
  label: string;

  @Column({
    type: 'enum',
    enum: UnitType,
    default: UnitType.APARTMENT,
  })
  type: UnitType;

  @Column({ type: 'int', nullable: true })
  floor?: number;

  @Column({ type: 'decimal', precision: 8, scale: 2, nullable: true })
  m2?: number;

  @Column({ type: 'boolean', default: false })
  isRented: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ownershipPercentage?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Building, (building) => building.units)
  @JoinColumn({ name: 'buildingId' })
  building: Building;

  @OneToMany(() => UnitOccupancy, (occupancy) => occupancy.unit)
  occupancies: UnitOccupancy[];
}
