import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { QueueEnum } from 'src/common/enum';

export class CreateQueueDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  @ApiPropertyOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  note: string;

  @ApiPropertyOptional()
  @IsString()
  coord: string;

  @ApiPropertyOptional()
  @IsString()
  code: string;

  @ApiPropertyOptional()
  @IsString()
  description: string;

  @ApiPropertyOptional()
  @IsEnum(QueueEnum)
  status: string;

  // relations

  @ApiPropertyOptional()
  eventId: number;
}
