import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export abstract class BaseDto {
  @ApiPropertyOptional()
  @Expose()
  id: number;

  // @ApiProperty()
  @Expose()
  @ApiPropertyOptional({
    default: new Date(),
  })
  createdAt: Date;
  // @ApiProperty()
  @Expose()
  @ApiPropertyOptional({
    default: new Date(),
  })
  updatedAt: Date;
}
