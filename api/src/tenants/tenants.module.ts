import { Module, forwardRef } from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { TenantsController } from './tenants.controller';
import { TenantsRepository } from './tenants.repository';
import { Tenant } from './entities/tenants.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tenant]),
    forwardRef(() => UsersModule),
    LoggerModule,
  ],
  controllers: [TenantsController],
  providers: [TenantsService, TenantsRepository],
  exports: [TenantsRepository],
})
export class TenantsModule {}
