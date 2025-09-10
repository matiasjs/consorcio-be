import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('staff_profiles')
export class StaffProfile extends BaseEntity {
  @Column({ type: 'uuid', unique: true })
  userId: string;

  @Column({ type: 'varchar', length: 100 })
  position: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  documentId?: string;

  @Column({ type: 'date', nullable: true })
  hireDate?: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  salary?: number;

  @Column({ type: 'varchar', length: 10, default: 'ARS' })
  currency: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  // Relations
  @OneToOne(() => User, (user) => user.staffProfile)
  @JoinColumn({ name: 'userId' })
  user: User;
}
