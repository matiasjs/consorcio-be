import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('tenant_profiles')
export class TenantProfile extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  documentType?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  documentNumber?: string;

  @Column({ type: 'date', nullable: true })
  birthDate?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  emergencyContact?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  emergencyPhone?: string;

  @Column({ type: 'date', nullable: true })
  leaseStartDate?: Date;

  @Column({ type: 'date', nullable: true })
  leaseEndDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  monthlyRent?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  // Relations
  @OneToOne(() => User, (user) => user.tenantProfile)
  @JoinColumn({ name: 'userId' })
  user: User;
}
