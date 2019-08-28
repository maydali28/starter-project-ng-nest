import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LoggerSharedService,
  ) { }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<String[]>('roles', context.getHandler());
    if (!roles || roles.length === 0) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    // @ts-ignore
    const user: InstanceType<User> = request.user;

    this.loggerService.debug('RolesGuard', user);

    if (!user || !user.roles) {
      return false;
    }

    const hasRole = () => {
      if (typeof (user.role) === 'string') {
        return roles.indexOf(user.role);
      } else {
        return user.roles.some(role => !!roles.find(item => item === role));
      }
      return false;
    };

    return user && user.role && hasRole();
    // throw new HttpException('You do not have permission you are ' + user.role + 'but ' + roles, HttpStatus.UNAUTHORIZED);
  }

}
