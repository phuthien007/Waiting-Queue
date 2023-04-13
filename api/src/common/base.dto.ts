import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export abstract class BaseDto {
  @ApiPropertyOptional()
  id: string;

  // @ApiProperty()
  @ApiPropertyOptional()
  createdAt: Date;
  // @ApiProperty()
  @ApiPropertyOptional()
  updatedAt: Date;
  // @ApiProperty()
  @ApiPropertyOptional()
  deletedAt: Date;
}
