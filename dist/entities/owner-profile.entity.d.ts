import { BaseEntity } from './base.entity';
import { User } from './user.entity';
export declare class OwnerProfile extends BaseEntity {
    userId: string;
    notes?: string;
    documentType?: string;
    documentNumber?: string;
    birthDate?: Date;
    emergencyContact?: string;
    emergencyPhone?: string;
    user: User;
}
