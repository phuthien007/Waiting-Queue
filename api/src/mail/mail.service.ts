import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  /**
   * Send email to user with reset token
   * @param token Reset token
   *  @param user User object
   *
   */
  async sendResetToken(token: string, user: User) {
    const url = `${
      process.env.CLIENT_URL || 'http://localhost:80'
    }/reset-password/${token}`;
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: 'Support Team <support@gmail.com>', // override default from
        subject: 'Tạo mật khẩu mới ✔',
        template: './createResetPassword', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.fullName,
          email: user.email,
          tenant: user.tenant.name,
          url,
        },
      });
    } catch (error) {
      console.log('error when send mail', error);
    }
  }

  /**
   * Send email notification to user when reset password success
   * @param user User object
   */
  async sendResetPasswordSuccess(user: User) {
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: 'Support Team <support@gmail.com>', // override default from
        subject: 'Đổi mật khẩu thành công ✔',
        template: './resetPasswordSuccess', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.fullName,
          email: user.email,
          tenant: user.tenant.name,
        },
      });
    } catch (error) {
      console.log('error when send mail', error);
    }
  }

  async sendChangePasswordSuccess(user: User) {
    try {
      this.mailerService.sendMail({
        to: user.email,
        from: 'Support Team <support@gmail.com>',
        subject: 'Đổi mật khẩu thành công ✔',
        template: './changePasswordSuccess', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          name: user.fullName,
          email: user.email,
          tenant: user.tenant.name,
        },
      });
    } catch (error) {
      console.log('error when send mail', error);
    }
  }
  async sendRegisterTenantSuccess(
    user: User,
    password: string,
    tenantCode: string,
  ) {
    try {
      const url = `${
        process.env.CLIENT_URL || 'http://localhost:80'
      }/auth/login`;
      this.mailerService.sendMail({
        to: user.email,
        from: 'Support Team <support@gmail.com>',
        subject: 'Đăng ký thành công ✔',
        template: './registerTenantSuccess', // `.hbs` extension is appended automatically
        context: {
          // ✏️ filling curly brackets with content
          url,
          name: user.fullName,
          email: user.email,
          password: password,
          tenant: user.tenant.name,
          tenantCode: tenantCode,
        },
      });
    } catch (error) {
      console.log('error when send mail', error);
    }
  }
}
