import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/users/dto/user.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // configure the strategy
    super({
      usernameField: 'email',
      passReqToCallback: true,
      // passwordField: 'password',
      // tenantCodeField: '',
    });
  }

  async validate(
    // { email, password, tenantCode }
    { body },
  ): Promise<any> {
    // console.log(body);
    const user = await this.authService.validateUser({
      ...body,
    });
    if (!user) {
      throw new UnauthorizedException('Tài khoản hoặc mật khẩu không đúng');
    }
    const { password, ...result } = user;
    return plainToInstance(UserDto, result);

    // return true;
  }
}
