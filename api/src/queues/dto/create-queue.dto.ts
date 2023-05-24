import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { QueueEnum } from 'src/common/enum';

/**
 * CreateQueueDto class for create queue DTO object from request body
 */
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

  @ApiPropertyOptional({
    enum: QueueEnum,
    default: QueueEnum.PENDING,
  })
  @IsEnum(QueueEnum)
  status: string;

  @ApiPropertyOptional({
    default: false,
  })
  isDynamic: boolean;

  @ApiPropertyOptional()
  dateGetQrcode: Date;
  // relations

  @ApiPropertyOptional()
  @IsNotEmpty({ message: 'Event ID không được để trống' })
  eventId: string;
}
