import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AssistantConfig } from '../../config/assistant.config';

@Injectable()
export class AssistantGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const assistantConfig = this.configService.get<AssistantConfig>('assistant');
    
    if (!assistantConfig?.enabled) {
      throw new ForbiddenException('Assistant feature is disabled');
    }

    return true;
  }
}

@Injectable()
export class AssistantApplyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const assistantConfig = this.configService.get<AssistantConfig>('assistant');
    
    if (!assistantConfig?.enabled) {
      throw new ForbiddenException('Assistant feature is disabled');
    }

    // Check if user has permission to apply changes (not just dry-run)
    const userRoles = user?.roles || [];
    const canApply = userRoles.some((role: any) => 
      ['SUPERADMIN', 'ADMIN'].includes(role.name?.toUpperCase())
    );

    if (!canApply && assistantConfig.defaultMode === 'dry-run') {
      // Allow dry-run for all authenticated users
      return true;
    }

    if (!canApply) {
      throw new ForbiddenException(
        'Insufficient permissions to apply assistant changes. Only administrators can execute actions.'
      );
    }

    return true;
  }
}
