import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, RolesEnum } from 'shared/constants';
import { AuthService } from 'modules/auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RolesEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException({
        message: 'Not authorized',
      });
    }
    const bearer = authHeader.split(' ')[0];
    const token = authHeader.split(' ')[1];

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        message: 'Not authorized',
      });
    }
    let user: any;
    try {
      user = this.authService.verifyUser(token);
      req.user = user;
    } catch (error) {
      throw new UnauthorizedException({
        message: 'Invalid token',
      });
    }
    if (user && user.role && requiredRoles.includes(user.role)) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}
