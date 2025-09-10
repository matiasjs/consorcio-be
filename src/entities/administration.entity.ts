import { Entity, Column, OneToMany, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Building } from './building.entity';
import { Vendor } from './vendor.entity';

export enum PlanTier {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}

@Entity('administrations')
@Index(['cuit'], { unique: true })
@Index(['email'], { unique: true })
export class Administration extends BaseEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  cuit: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({
    type: 'enum',
    enum: PlanTier,
    default: PlanTier.BASIC,
  })
  planTier: PlanTier;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @OneToMany(() => User, (user) => user.administration)
  users: User[];

  @OneToMany(() => Building, (building) => building.administration)
  buildings: Building[];

  @OneToMany(() => Vendor, (vendor) => vendor.administration)
  vendors: Vendor[];
}
