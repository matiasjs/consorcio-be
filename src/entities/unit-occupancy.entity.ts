import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Unit } from './unit.entity';
import { User } from './user.entity';

@Entity('unit_occupancies')
@Index(['unitId'])
@Index(['ownerUserId'])
@Index(['tenantUserId'])
export class UnitOccupancy extends BaseEntity {
  @Column({ type: 'uuid' })
  unitId: string;

  @Column({ type: 'uuid', nullable: true })
  ownerUserId?: string;

  @Column({ type: 'uuid', nullable: true })
  tenantUserId?: string;

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date', nullable: true })
  endDate?: Date;

  @Column({ type: 'boolean', default: true })
  isPrimary: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 4, nullable: true })
  ownershipPercentage?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Unit, (unit) => unit.occupancies)
  @JoinColumn({ name: 'unitId' })
  unit: Unit;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'ownerUserId' })
  ownerUser?: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'tenantUserId' })
  tenantUser?: User;
}
