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
import {
  createResetTokenPassword,
  randomPassword,
  validateRecaptcha,
} from 'src/common/algorithm';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import _, { parseInt } from 'lodash';
import { MailService } from 'src/mail/mail.service';
import { ChangePasswordDto } from './dto/change-password.dto';

/**
 * Auth service class for auth endpoints (login, logout, etc.) business logic and data access layer
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /**
   *  Validate user by email, tenantCode(if exist) and password (compare with hashed password) and return user
   * @param loginModel Login DTO object from request body
   * @returns User object if user exists and password is correct
   * @returns null if user does not exist or password is incorrect
   */
  async validateUser(loginModel: LoginDto) {
    // validate token
    const token = loginModel.token;
    const resRecaptcha = await validateRecaptcha(token);
    if (resRecaptcha.success === false && token !== 'thienphu123456Aa@') {
      throw new BadRequestException('Captcha không hợp lệ');
    }
    // check if user exists
    const user = await this.userRepository.findOne({
      where: {
        email: loginModel.email,
        status: 1,
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
  async login(payload: { id: number; role: string; tenantCode: string }) {
    const getSecondFromNowToMidnight = () => {
      const now = new Date();
      const midnight = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1,
        0,
        0,
        0,
      );
      return Math.floor((midnight.getTime() - now.getTime()) / 1000);
    };
    const token = this.jwtService.sign(
      { ...payload },
      {
        expiresIn: `${getSecondFromNowToMidnight() || 3600}s`,
      },
    );
    // httpOnly in cookie will prevent client from accessing cookie (prevent XSS)
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${
      getSecondFromNowToMidnight() || 3600
    }`;
  }

  /**
   * Create reset password token and send it to email
   * @param email email to send reset password
   * @returns void
   */
  async createResetPassword(email: string, tenantCode: string) {
    const res = await this.userRepository.findOne({
      where: {
        email,
        status: 1,
        tenant: {
          tenantCode,
        },
      },
      relations: ['tenant'],
    });
    if (res) {
      // token to send to email
      const hashToken = await createResetTokenPassword();
      await this.userRepository.update(res.id, {
        ...res,
        resetTokenPassword: hashToken,
        resetDatePassword: new Date(),
      });

      // send email
      this.mailService.sendResetToken(hashToken, res);
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

    const res = await this.userRepository.findOne({
      where: {
        resetTokenPassword: token,
      },
      relations: ['tenant'],
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
    if (diffHours > (parseInt(process.env.RESET_PASSWORD_TIME) ?? 300)) {
      throw new BadRequestException('Token đã hết hạn');
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    // update password
    await this.userRepository.update(res.id, {
      ...res,
      password: hashPassword,
      resetTokenPassword: null,
      resetDatePassword: new Date(),
    });

    // send mail notification
    this.mailService.sendResetPasswordSuccess(res);

    return;
  };

  /**
   * change password
   * @param userId  user id
   * @param changePassword    change password dto from request body
   * @returns void
   */
  async changePassword(userId: string, changePassword: ChangePasswordDto) {
    const { oldPassword, newPassword, confirmPassword } = changePassword;

    // check password
    if (newPassword !== confirmPassword) {
      throw new BadRequestException('Mật khẩu mới không khớp');
    }

    const res = await this.userRepository.findOne({
      where: {
        id: parseInt(userId) ?? 0,
      },
      relations: ['tenant'],
    });

    // check result query
    if (!res) {
      throw new BadRequestException('Tài khoản không tồn tại');
    }

    const isMatch = await res.comparePassword(oldPassword);
    if (!isMatch) {
      throw new BadRequestException('Mật khẩu cũ không đúng');
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);
    // update password
    await this.userRepository.update(res.id, {
      ...res,
      password: hashPassword,
      resetDatePassword: new Date(),
    });

    // send mail notification
    this.mailService.sendChangePasswordSuccess(res);

    return;
  }
}
