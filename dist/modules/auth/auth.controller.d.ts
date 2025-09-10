import type { RequestUser } from '../../common/interfaces';
import { AuthService } from './auth.service';
import { AuthResponseDto, LoginDto, RefreshTokenDto } from './dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(req: any, loginDto: LoginDto): Promise<AuthResponseDto>;
    refresh(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto>;
    getProfile(user: RequestUser): Promise<{
        id: string;
        email: string;
        fullName: string;
        roles: import("../../common/enums").UserRole[];
        adminId: string;
    }>;
}
