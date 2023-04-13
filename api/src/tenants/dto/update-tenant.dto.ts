import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { BaseDto } from 'src/common/base.dto';

export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
