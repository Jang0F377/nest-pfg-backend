import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY, ROLES, ROLES_KEY } from 'src/constants/user';
import { JwtService } from 'src/services/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.get(IS_PUBLIC_KEY, context.getHandler());
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest<Request>();

    const requiredRole: Array<ROLES> = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRole) return false;

    const getTokenHeader = request.header('token');
    if (!getTokenHeader) {
      throw new UnauthorizedException('NO AUTH TOKEN DETECTED');
    }

    const { role } = await this.jwtService.validateToken(getTokenHeader);
    const allowed = requiredRole.some((x) => x === role);

    return allowed;
  }
}
