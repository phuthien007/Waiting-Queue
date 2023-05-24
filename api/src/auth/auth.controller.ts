/*
https://docs.nestjs.com/controllers#controllers
*/

import {
  Body,
  Controller,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HasRole } from 'src/common/decorators';
import { RoleGuard } from './role.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RecaptchaInterceptor } from './recaptcha.interceptor';
import { RoleEnum } from 'src/common/enum';

/**
 * Auth controller class for auth endpoints (login, logout, etc.)
 */
@Controller('/api/auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Login endpoint
   * @param login Login DTO object from request body
   * @param req Request from client (contains user data)
   * @param res Response to client (contains cookie)
   * @returns Login success message and user data
   * @returns Login failed message
   */
  @Post('login')
  @UseGuards(RoleGuard)
  @HasRole()
  @ApiCreatedResponse({ description: 'Login success' })
  @ApiUnauthorizedResponse({ description: 'Login failed' })
  @UseGuards(LocalAuthGuard)
  async login(
    @Body() login: LoginDto,
    @Req() req: any,
    @Res({ passthrough: true }) res: any,
  ) {
    // Create cookie and set it to response header (res)
    const cookie = await this.authService.login({
      id: req.user.id,
      role: req.user.role,
      tenantCode: login.tenantCode,
    });
    res.setHeader('Set-Cookie', cookie);
    return {
      message: 'Login success',
      data: req.user,
    };
  }

  // create reset password
  /**
   * create reset password endpoint
   * @param resetPassword  ResetPasswordDto object from request body, require email
   * @returns Create reset password success message
   */
  @Post('reset-password')
  @UseGuards(RoleGuard)
  @HasRole()
  @ApiCreatedResponse({ description: 'Create reset password success' })
  createResetPassword(@Body() resetPassword: ResetPasswordDto) {
    return this.authService.createResetPassword(
      resetPassword.email,
      resetPassword.tenantCode,
    );
  }

  // finish reset password
  /**
   *  finish reset password endpoint
   * @param token a reset token which is created by createResetPassword endpoint
   * @param resetPassword ResetPasswordDto object from request body, require password and confirmPassword
   * @returns Finish reset password success message
   */
  @Post('finish-reset-password/:token')
  @UseGuards(RoleGuard)
  @HasRole()
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        password: {
          type: 'string',
        },
        confirmPassword: {
          type: 'string',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'Finish reset password success' })
  finishResetPassword(
    @Param('token') token: string,
    @Body() resetPassword: any,
  ) {
    return this.authService.finishResetPassword(token, resetPassword);
  }
  // logout endpoint
  /**
   * Logout endpoint (remove cookie)
   * @param res Response to client (contains cookie)
   * @returns Logout success message
   */
  @Post('logout')
  @UseGuards(RoleGuard)
  @HasRole()
  @ApiCreatedResponse({ description: 'Logout success' })
  async logout(@Res({ passthrough: true }) res: any) {
    // remove Authentication out of cookie
    res.clearCookie('Authentication');

    return {
      message: 'Logout success',
    };
  }

  // change password endpoint
  /**
   *  change password endpoint
   * @param changePassword ResetPasswordDto object from request body, require password and confirmPassword
   * @returns Change password success message
   * @returns Change password failed message
   * @throws {BadRequestException} - if changePassword is invalid
   * @throws {InternalServerErrorException} - if error occurs during changing password
   * @throws {NotFoundException} - if user is not found
   * @throws {UnauthorizedException} - if old password is incorrect
   * @throws {ForbiddenException} - if user is not allowed to change password
   * @throws {ConflictException} - if new password is the same as old password
   * @throws {UnprocessableEntityException} - if new password is the same as old password
   */
  @Post('change-password')
  @UseGuards(RoleGuard)
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR, RoleEnum.SUPER_ADMIN)
  @ApiCreatedResponse({ description: 'Change password success' })
  @ApiUnauthorizedResponse({ description: 'Change password failed' })
  changePassword(@Req() req: any, @Body() changePassword: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePassword);
  }
}
