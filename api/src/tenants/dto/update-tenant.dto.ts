import { PartialType } from '@nestjs/swagger';
import { CreateTenantDto } from './create-tenant.dto';
import { BaseDto } from 'src/common/base.dto';

/**
 * UpdateTenantDto class for update tenant DTO object from request body
 */
export class UpdateTenantDto extends PartialType(CreateTenantDto) {}
