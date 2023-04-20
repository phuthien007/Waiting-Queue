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
import { createResetTokenPassword } from 'src/common/algorithm';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import _ from 'lodash';

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

  /**
   * Create reset password token and send it to email
   * @param email email to send reset password
   * @returns void
   */
  async createResetPassword(email: string) {
    let res = await this.userRepository.findOne({
      where: {
        email,
      },
    });
    if (res) {
      // token to send to email
      const hashToken = createResetTokenPassword();
      res = await this.userRepository.save({
        ...res,
        resetPasswordToken: hashToken,
        resetDatePassword: new Date(),
      });

      // send email
    }
    return;
  }

  /**
   * finish reset password
   * @param token token from email to reset password
   * @param resetPassword reset password dto from request body
   * @returns void
   */
  finishResetPassword = async (
    token: string,
    resetPassword: ResetPasswordDto,
  ) => {
    const { replyPassword, newPassword } = resetPassword;

    // check password
    if (newPassword !== replyPassword) {
      throw new BadRequestException('Mật khẩu mới không khớp');
    }

    let res = await this.userRepository.findOne({
      where: {
        resetTokenPassword: token,
      },
    });

    // check result query
    if (!res) {
      throw new BadRequestException('Token không tồn tại');
    }

    // check token expired
    const now = new Date();
    const resetDatePassword = new Date(res.resetDatePassword);
    const diff = now.getTime() - resetDatePassword.getTime();
    // unit is second
    const diffHours = Math.floor(diff / 1000);

    // default time is 5 minutes
    if (diffHours > _.toSafeInteger(process.env.RESET_PASSWORD_TIME) || 300) {
      throw new BadRequestException('Token đã hết hạn');
    }

    // update password
    res = await this.userRepository.save({
      ...res,
      password: newPassword,
      resetPasswordToken: null,
      resetDatePassword: null,
    });

    return;
  };
}
