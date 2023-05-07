import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class CreateSessionDto {
  @IsString()
  browser: string;
}
