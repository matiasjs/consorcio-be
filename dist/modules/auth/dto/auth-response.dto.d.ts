import { UserRole } from '../../../common/enums';
export declare class AuthResponseDto {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: {
        id: string;
        email: string;
        fullName: string;
        roles: UserRole[];
        adminId: string;
    };
}
