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
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './local-auth.guard';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { HasRole } from 'src/common/decorators';
import { RoleGuard } from './role.guard';
import { ResetPasswordDto } from './dto/resetPassword.dto';

/**
 * Auth controller class for auth endpoints (login, logout, etc.)
 */
@Controller('/api/auth')
@UseGuards(RoleGuard)
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
  @HasRole()
  @ApiCreatedResponse({ description: 'Finish reset password success' })
  finishResetPassword(@Param('token') token: string, @Body() resetPassword) {
    return this.authService.finishResetPassword(token, resetPassword);
  }
  // logout endpoint
  /**
   * Logout endpoint (remove cookie)
   * @param res Response to client (contains cookie)
   * @returns Logout success message
   */
  @Post('logout')
  @HasRole()
  @ApiCreatedResponse({ description: 'Logout success' })
  async logout(@Res({ passthrough: true }) res: any) {
    // remove Authentication out of cookie
    res.clearCookie('Authentication');

    return {
      message: 'Logout success',
    };
  }
}
