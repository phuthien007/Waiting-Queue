import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

/**
 * JWT strategy class for JWT authentication strategy (validate JWT token)
 * @see https://docs.nestjs.com/security/authentication#strategies
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   *
   * @param configService Config service for getting JWT secret key from .*.env file
   * @returns extends PassportStrategy(Strategy)
   */
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
    });
  }

  /**
   *  Validate JWT token and return payload object
   * @param payload Payload object contains user id and role (for JWT)
   * @returns object contains user id and role
   */
  async validate(payload: any) {
    // const user = await this.authService.validateUser(payload.username);
    return {
      id: payload.id,
      role: payload.role,
      tenantCode: payload.tenantCode,
    };
  }
}
