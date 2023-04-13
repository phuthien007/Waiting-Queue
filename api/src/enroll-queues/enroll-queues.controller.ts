import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EnrollQueuesService } from './enroll-queues.service';
import { CreateEnrollQueueDto } from './dto/create-enroll-queue.dto';
import { UpdateEnrollQueueDto } from './dto/update-enroll-queue.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('enroll-queues')
@Controller('enroll-queues')
export class EnrollQueuesController {
  constructor(private readonly enrollQueuesService: EnrollQueuesService) {}

  @Post()
  create(@Body() createEnrollQueueDto: CreateEnrollQueueDto) {
    return this.enrollQueuesService.create(createEnrollQueueDto);
  }

  @Get()
  findAll() {
    return this.enrollQueuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.enrollQueuesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEnrollQueueDto: UpdateEnrollQueueDto,
  ) {
    return this.enrollQueuesService.update(+id, updateEnrollQueueDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.enrollQueuesService.remove(+id);
  }
}
