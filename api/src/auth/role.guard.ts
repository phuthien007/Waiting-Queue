import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from 'src/common/decorators';
import { RoleEnum } from 'src/common/enum';

/**
 * Role guard class for role-based authorization (check if user has role to access route or not)
 */
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );
    // public route
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // validate user role
    const request = context.switchToHttp().getRequest();
    if (!request.user) {
      return false;
    }
    const userRole = request.user.role;
    // check if user login has role which is in requiredRoles array
    if (requiredRoles.filter((item) => userRole.includes(item)).length > 0) {
      return true;
    }
    return false;
  }
}
