import { UserRole } from '../../../common/enums/user-role.enum';
export declare class CreateUserDto {
    email: string;
    phone: string;
    password: string;
    fullName: string;
    roles: UserRole[];
    status?: string;
}
