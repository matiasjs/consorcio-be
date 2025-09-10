import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { RequestUser } from '../interfaces';
import { UserRole } from '../enums';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
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
