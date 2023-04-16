import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QueueDto } from './dto/queue.dto';
import { FilterOperator } from 'src/common/filters.vm';
@ApiTags('queues')
@Controller('queues')
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  @Post()
  @ApiCreatedResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queuesService.create(createQueueDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: FilterOperator,
    description: 'Search query',
  })
  @ApiOkResponse({ type: [QueueDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(@Query() search: any) {
    return this.queuesService.findAll(search);
  }

  @Get(':id')
  @ApiOkResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateQueueDto: UpdateQueueDto,
  ) {
    return this.queuesService.update(+id, updateQueueDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.remove(+id);
  }
}
