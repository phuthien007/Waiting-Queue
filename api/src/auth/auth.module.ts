import { Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { RoleGuard } from './role.guard';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'secretKey',
        signOptions: {
          expiresIn: `${configService.get('JWT_EXPIRATION_TIME') || 3600}s`,
        },
        global: true,
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, RoleGuard],
  exports: [RoleGuard],
})
export class AuthModule {}
