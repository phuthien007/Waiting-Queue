import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { RoleGuard } from './auth/role.guard';
import { HasRole } from './common/decorators';
import { RoleEnum } from './common/enum';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(RoleGuard)
  @HasRole()
  // @UseGuards(JwtAuthGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
