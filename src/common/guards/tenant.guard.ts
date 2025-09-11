import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserRole } from '../enums';
import { RequestUser } from '../interfaces';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    // Check if the route is public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user: RequestUser = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // SUPERADMIN can access any tenant
    if (user.roles.includes(UserRole.SUPERADMIN)) {
      return true;
    }

    // Extract admin_id from request params or query
    const adminId = request.params?.adminId || request.query?.admin_id || request.body?.adminId;

    // If no adminId in request, allow (will be filtered by user's adminId in service)
    if (!adminId) {
      return true;
    }

    // Check if user belongs to the requested tenant
    if (user.adminId !== adminId) {
      throw new ForbiddenException('Access denied to this tenant');
    }

    return true;
  }
}
