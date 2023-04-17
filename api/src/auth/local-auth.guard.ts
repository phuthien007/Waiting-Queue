import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Local auth guard class for local authentication strategy (validate username and password)
 */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
