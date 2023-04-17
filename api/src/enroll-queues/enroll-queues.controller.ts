import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { EnrollQueuesService } from './enroll-queues.service';
import { CreateEnrollQueueDto } from './dto/create-enroll-queue.dto';
import { UpdateEnrollQueueDto } from './dto/update-enroll-queue.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EnrollQueueDto } from './dto/enroll-queue.dto';
import { FilterOperator } from 'src/common/filters.vm';

@ApiTags('enroll-queues')
@Controller('enroll-queues')
export class EnrollQueuesController {
  constructor(private readonly enrollQueuesService: EnrollQueuesService) {}

  @Post()
  @ApiCreatedResponse({ type: EnrollQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createEnrollQueueDto: CreateEnrollQueueDto) {
    return this.enrollQueuesService.create(createEnrollQueueDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: FilterOperator,
    description: 'Search query',
  })
  @ApiOkResponse({ type: [EnrollQueueDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(@Query() search: any) {
    return this.enrollQueuesService.findAll(search);
  }

  @Get(':id')
  @ApiOkResponse({ type: EnrollQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.enrollQueuesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: EnrollQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
    @Param('id', ParseIntPipe) id: number,

    @Body() updateEnrollQueueDto: UpdateEnrollQueueDto,
  ) {
    return this.enrollQueuesService.update(+id, updateEnrollQueueDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.enrollQueuesService.remove(+id);
  }
}
