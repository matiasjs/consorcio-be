import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission, Role, User } from '../../entities';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  PermissionsController,
  RolesController,
  UserRolesController,
} from './controllers';
import { PermissionsService, RolesService, UserRolesService } from './services';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Permission]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [
    AuthController,
    RolesController,
    PermissionsController,
    UserRolesController,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    LocalStrategy,
    RolesService,
    PermissionsService,
    UserRolesService,
  ],
  exports: [AuthService, RolesService, PermissionsService, UserRolesService],
})
export class AuthModule {}
