import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from 'modules/auth';
import { Observable } from 'rxjs';
import { RolesEnum } from 'shared/constants';

@Injectable()
export class AdminRoleGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException();
      }
      const user = this.authService.verifyUser(token);
      req.user = user;
      if (user.role !== RolesEnum.ADMIN) {
        throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
      }
      return true;
    } catch (e) {
      throw new HttpException('FORBIDDEN', HttpStatus.FORBIDDEN);
    }
  }
}
