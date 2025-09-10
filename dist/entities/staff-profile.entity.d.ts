import { BaseEntity } from './base.entity';
import { User } from './user.entity';
export declare class StaffProfile extends BaseEntity {
    userId: string;
    position: string;
    documentId?: string;
    hireDate?: Date;
    salary?: number;
    currency: string;
    notes?: string;
    isActive: boolean;
    user: User;
}
