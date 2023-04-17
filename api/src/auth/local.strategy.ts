import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

/**
 * Local strategy class for local authentication strategy (validate username and password)
 * @see https://docs.nestjs.com/security/authentication#strategies
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // configure the strategy
    super({
      // change the default username field to email
      usernameField: 'email',
      // set true to pass the entire request to validate()
      passReqToCallback: true,
    });
  }

  /**
   * Validate user
   * @param param0 received request object from client
   * @returns user object if validate successfully
   * @returns throw UnauthorizedException if validate failed
   */
  async validate({ body }): Promise<any> {
    const user = await this.authService.validateUser({
      ...body,
    });

    // throw UnauthorizedException if validate failed
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }

    // remove password from user object
    const { password, ...result } = user;

    return plainToInstance(UserDto, result);
  }
}
