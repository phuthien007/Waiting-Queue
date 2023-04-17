/*
https://docs.nestjs.com/providers#services
*/

import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/users/users.repository';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from 'src/common/enum';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

/**
 * Auth service class for auth endpoints (login, logout, etc.) business logic and data access layer
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  /**
   *  Validate user by email, tenantCode(if exist) and password (compare with hashed password) and return user
   * @param loginModel Login DTO object from request body
   * @returns User object if user exists and password is correct
   * @returns null if user does not exist or password is incorrect
   */
  async validateUser(loginModel: LoginDto) {
    // check if user exists
    const user = await this.userRepository.findOne({
      where: {
        email: loginModel.email,
        status: true,
        tenant: {
          tenantCode: loginModel.tenantCode,
        },
      },
    });

    if (!user) {
      //   throw new BadRequestException('Tài khoản hoặc mật khẩu không đúng');
      return null;
    }
    const isMatch = await user.comparePassword(loginModel.password);
    if (!isMatch) {
      //   throw new BadRequestException('Tài khoản hoặc mật khẩu không đúng');
      return null;
    }
    return user;
    // if passing all checks, return user
  }

  /**
   * Create cookie and return it
   * @param payload Payload object contains user id and role (for JWT)
   * @returns Cookie string
   */
  async login(payload: { id: number; role: string }) {
    const token = this.jwtService.sign({ ...payload });
    // httpOnly in cookie will prevent client from accessing cookie (prevent XSS)
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${
      this.configService.get('JWT_EXPIRATION_TIME') || 3600
    }`;
  }
}
