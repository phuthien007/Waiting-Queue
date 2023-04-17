/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
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

/**
 * Auth controller class for auth endpoints (login, logout, etc.)
 */
@Controller()
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
}
