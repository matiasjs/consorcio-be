import { Entity, Column, ManyToOne, JoinColumn, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { VendorAvailability } from './vendor-availability.entity';

@Entity('vendors')
@Index(['adminId'])
@Index(['trade'])
export class Vendor extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'varchar', length: 255 })
  legalName: string;

  @Column({ type: 'varchar', length: 100 })
  trade: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  whatsapp?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  ratingAvg: number;

  @Column({ type: 'int', default: 0 })
  ratingCount: number;

  @Column({ type: 'boolean', default: false })
  isPreferred: boolean;

  @Column({ type: 'varchar', length: 20, nullable: true })
  cuit?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  website?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'json', nullable: true })
  certifications?: string[];

  @Column({ type: 'json', nullable: true })
  serviceAreas?: string[];

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Administration, (administration) => administration.vendors)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @OneToMany(() => VendorAvailability, (availability) => availability.vendor)
  availabilities: VendorAvailability[];
}
