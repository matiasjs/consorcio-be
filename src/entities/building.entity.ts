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
import { Unit } from './unit.entity';

@Entity('buildings')
@Index(['adminId'])
export class Building extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'varchar', length: 100 })
  city: string;

  @Column({ type: 'varchar', length: 100, default: 'Argentina' })
  country: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'int', nullable: true })
  totalFloors?: number;

  @Column({ type: 'int', nullable: true })
  totalUnits?: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Administration, (administration) => administration.buildings)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @OneToMany(() => Unit, (unit) => unit.building)
  units: Unit[];
}
