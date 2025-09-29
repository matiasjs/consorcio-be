import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    // DEBUG: Log all requests to buildings endpoints
    if (request.url?.includes('buildings')) {
      console.log('🔐 JwtAuthGuard:', {
        timestamp: new Date().toISOString(),
        method: request.method,
        url: request.url,
        origin: request.headers.origin,
        headers: Object.keys(request.headers),
      });
    }

    // Skip authentication for OPTIONS requests (CORS preflight) - FIRST PRIORITY
    if (request.method === 'OPTIONS') {
      console.log(
        `🔐 JwtAuthGuard: ✅ ALLOWING OPTIONS request for CORS preflight - ${new Date().toISOString()}`,
      );
      return true;
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      console.log(
        `🔐 JwtAuthGuard: ✅ ALLOWING public route - ${new Date().toISOString()}`,
      );
      return true;
    }

    console.log(
      `🔐 JwtAuthGuard: 🔒 Checking JWT authentication - ${new Date().toISOString()}`,
    );
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token');
    }
    return user;
  }
}
