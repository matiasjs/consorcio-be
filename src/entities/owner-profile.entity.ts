import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('owner_profiles')
export class OwnerProfile extends BaseEntity {
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

  // Relations
  @OneToOne(() => User, (user) => user.ownerProfile)
  @JoinColumn({ name: 'userId' })
  user: User;
}
