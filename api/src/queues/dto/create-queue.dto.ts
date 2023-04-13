import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';
import { QueueEnum } from 'src/common/enum';

export class CreateQueueDto extends BaseDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  note: string;

  @IsString()
  coord: string;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsEnum(QueueEnum)
  status: string;

  // relations

  eventId: number;
}
