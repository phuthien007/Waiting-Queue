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
  UseGuards,
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
import { RoleGuard } from 'src/auth/role.guard';
/**
 * QueuesController class for queues controller with CRUD operations for queues
 */
@ApiTags('queues')
@Controller('queues')
@UseGuards(RoleGuard)
export class QueuesController {
  constructor(private readonly queuesService: QueuesService) {}

  /**
   *  Create a new queue with createQueueDto
   * @param createQueueDto - CreateQueueDto object from request body
   * @returns QueueDto object with created queue data
   * @throws {BadRequestException} - if createQueueDto is invalid
   * @throws {InternalServerErrorException} - if error occurs during creating queue
   * @throws {NotFoundException} - if event with id from createQueueDto.eventId not found
   */
  @Post()
  @ApiCreatedResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createQueueDto: CreateQueueDto) {
    return this.queuesService.create(createQueueDto);
  }

  /**
   * Find all queues with search query params
   * @param search - search query params
   * @returns array of QueueDto objects with queues data
   * @throws {BadRequestException} - if search query params is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding queues
   */
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

  /**
   * Find queue by id
   * @param id - id of queue to find
   * @returns QueueDto object with queue data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding queue
   * @throws {NotFoundException} - if queue with id not found
   */
  @Get(':id')
  @ApiOkResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.findOne(+id);
  }

  /**
   * Update queue by id with updateQueueDto
   * @param id  - id of queue to update
   * @param updateQueueDto  - UpdateQueueDto object from request body
   * @returns  QueueDto object with updated queue data
   * @throws {BadRequestException} - if id or updateQueueDto is invalid
   * @throws {InternalServerErrorException} - if error occurs during updating queue
   * @throws {NotFoundException} - if queue with id not found
   */
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

  /**
   * Delete queue by id
   * @param id - id of queue to delete
   * @returns  QueueDto object with deleted queue data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during deleting queue
   * @throws {NotFoundException} - if queue with id not found
   */
  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.remove(+id);
  }
}
