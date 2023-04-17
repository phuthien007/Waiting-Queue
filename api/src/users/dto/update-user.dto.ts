import { CreateUserDto } from './create-user.dto';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsNumber, IsString } from 'class-validator';

/**
 * UpdateUserDto class for update user DTO object from request body
 */
export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional()
  @IsString()
  resetTokenPassword?: string;

  @ApiPropertyOptional()
  @IsDateString()
  resetDatePassword?: Date;

  @ApiPropertyOptional()
  @IsArray({
    message: 'queueIds must be an array',
  })
  queueIds?: number[];
}
