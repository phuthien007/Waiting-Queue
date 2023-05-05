import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  imports: [LoggerModule],
})
export class FilesModule {}
