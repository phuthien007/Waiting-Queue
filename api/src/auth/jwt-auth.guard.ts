import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { ROLES_KEY } from 'src/common/decorators';
import { RoleEnum } from 'src/common/enum';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const role: RoleEnum[] = this.reflector.getAllAndOverride<RoleEnum[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    ) as RoleEnum[];
    // console.log('role', role);
    // if done have role => public route
    if (role?.length == 0) {
      return true;
    }
    return super.canActivate(context);
  }
}
