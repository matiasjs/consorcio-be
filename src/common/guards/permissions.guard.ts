import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { RequestUser } from '../interfaces/request-user.interface';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // DEBUG: Log all requests to buildings endpoints
    if (request.url?.includes('buildings')) {
      console.log('🔑 PermissionsGuard:', {
        timestamp: new Date().toISOString(),
        method: request.method,
        url: request.url,
        origin: request.headers.origin,
        headers: Object.keys(request.headers),
      });
    }

    // Skip permissions validation for OPTIONS requests (CORS preflight) - FIRST PRIORITY
    if (request.method === 'OPTIONS') {
      console.log(
        `🔑 PermissionsGuard: ✅ ALLOWING OPTIONS request for CORS preflight - ${new Date().toISOString()}`,
      );
      return true;
    }

    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(
        `🔑 PermissionsGuard: ✅ ALLOWING public route - ${new Date().toISOString()}`,
      );
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermissions) {
      return true;
    }
    const user: RequestUser = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Extract permissions from user's roles (assuming they are in JWT payload)
    const userPermissions = user.permissions || [];

    const hasPermission = requiredPermissions.some((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasPermission) {
      throw new ForbiddenException(
        `Insufficient permissions. Required: ${requiredPermissions.join(', ')}`,
      );
    }

    return true;
  }
}
