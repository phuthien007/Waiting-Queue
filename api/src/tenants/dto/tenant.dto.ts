import { Injectable } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { BaseDto } from 'src/common/base.dto';

/**
 * TenantDto class for tenant DTO object from request body and response body
 */
export class TenantDto extends BaseDto {
  @ApiPropertyOptional()
  @Expose()
  name: string;
  @ApiPropertyOptional()
  @Exclude()
  tenantCode: string;
  @ApiPropertyOptional()
  @Expose()
  description: string;

  @Expose()
  @ApiPropertyOptional()
  address: string;

  @Expose()
  @ApiPropertyOptional()
  website: string;

  @Expose()
  @ApiPropertyOptional()
  contactPhone: string;

  @Expose()
  @ApiPropertyOptional()
  contactEmail: string;

  @Expose()
  @ApiPropertyOptional()
  status: boolean;

  @Expose()
  @ApiPropertyOptional()
  note: string;

  constructor(params: Partial<TenantDto>) {
    super();
    Object.assign(this, params);
  }
}
