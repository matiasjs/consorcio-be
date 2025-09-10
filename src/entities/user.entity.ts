import { Entity, Column, ManyToOne, JoinColumn, Index, OneToMany, OneToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Administration } from './administration.entity';
import { UserRole, UserStatus } from '../common/enums';
import { OwnerProfile } from './owner-profile.entity';
import { TenantProfile } from './tenant-profile.entity';
import { StaffProfile } from './staff-profile.entity';

@Entity('users')
@Index(['email', 'adminId'], { unique: true })
@Index(['adminId'])
export class User extends BaseEntity {
  @Column({ type: 'uuid' })
  adminId: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  phone?: string;

  @Column({ type: 'varchar', length: 255 })
  passwordHash: string;

  @Column({ type: 'varchar', length: 255 })
  fullName: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.READONLY],
  })
  roles: UserRole[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.PENDING,
  })
  status: UserStatus;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt?: Date;

  @Column({ type: 'varchar', length: 45, nullable: true })
  lastLoginIp?: string;

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt?: Date;

  @Column({ type: 'varchar', length: 255, nullable: true })
  resetPasswordToken?: string;

  @Column({ type: 'timestamp', nullable: true })
  resetPasswordExpiresAt?: Date;

  // Relations
  @ManyToOne(() => Administration, (administration) => administration.users)
  @JoinColumn({ name: 'adminId' })
  administration: Administration;

  @OneToOne(() => OwnerProfile, (profile) => profile.user)
  ownerProfile?: OwnerProfile;

  @OneToOne(() => TenantProfile, (profile) => profile.user)
  tenantProfile?: TenantProfile;

  @OneToOne(() => StaffProfile, (profile) => profile.user)
  staffProfile?: StaffProfile;
}
