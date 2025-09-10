import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Vendor } from './vendor.entity';

export enum Weekday {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

@Entity('vendor_availabilities')
@Index(['vendorId'])
@Index(['vendorId', 'weekday'], { unique: true })
export class VendorAvailability extends BaseEntity {
  @Column({ type: 'uuid' })
  vendorId: string;

  @Column({
    type: 'enum',
    enum: Weekday,
  })
  weekday: Weekday;

  @Column({ type: 'time' })
  from: string;

  @Column({ type: 'time' })
  to: string;

  @Column({ type: 'json', nullable: true })
  exceptions?: Array<{
    date: string;
    from?: string;
    to?: string;
    unavailable?: boolean;
    reason?: string;
  }>;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @ManyToOne(() => Vendor, (vendor) => vendor.availabilities)
  @JoinColumn({ name: 'vendorId' })
  vendor: Vendor;
}
