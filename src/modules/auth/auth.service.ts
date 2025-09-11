import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { UserStatus } from '../../common/enums';
import { JwtPayload, JwtRefreshPayload } from '../../common/interfaces';
import { User } from '../../entities/user.entity';
import { AuthResponseDto, RefreshTokenDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) { }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email, status: UserStatus.ACTIVE },
      relations: ['administration', 'roles', 'roles.permissions'],
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async validateUserById(userId: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id: userId, status: UserStatus.ACTIVE },
      relations: ['administration', 'roles', 'roles.permissions'],
    });
  }

  async login(user: User): Promise<AuthResponseDto> {
    // Extract roles and permissions
    const roles = user.roles?.map(role => role.name) || [];
    const permissions = user.roles?.flatMap(role =>
      role.permissions?.map(permission => permission.code) || []
    ) || [];

    // Remove duplicates
    const uniquePermissions = [...new Set(permissions)];

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      adminId: user.adminId,
      roles,
      permissions: uniquePermissions,
    };

    const refreshPayload: JwtRefreshPayload = {
      sub: user.id,
      adminId: user.adminId,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('jwt.secret'),
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      }),
      this.jwtService.signAsync(refreshPayload, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
        expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
      }),
    ]);

    // Update last login
    await this.userRepository.update(user.id, {
      lastLoginAt: new Date(),
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: this.getTokenExpirationSeconds(),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions: uniquePermissions,
        adminId: user.adminId,
      },
    };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync<JwtRefreshPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: this.configService.get<string>('jwt.refreshSecret'),
        },
      );

      const user = await this.validateUserById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.login(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
  }

  private getTokenExpirationSeconds(): number {
    const expiresIn = this.configService.get<string>('jwt.expiresIn', '24h');

    // Parse time string (e.g., "24h", "30m", "7d")
    const timeValue = parseInt(expiresIn.slice(0, -1));
    const timeUnit = expiresIn.slice(-1);

    switch (timeUnit) {
      case 's':
        return timeValue;
      case 'm':
        return timeValue * 60;
      case 'h':
        return timeValue * 60 * 60;
      case 'd':
        return timeValue * 24 * 60 * 60;
      default:
        return 24 * 60 * 60; // Default to 24 hours
    }
  }
}
