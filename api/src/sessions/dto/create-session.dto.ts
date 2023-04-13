import { IsString } from 'class-validator';
import { BaseDto } from 'src/common/base.dto';

export class CreateSessionDto extends BaseDto {
  @IsString()
  token: string;

  @IsString()
  browser: string;
}
