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
  Req,
} from '@nestjs/common';
import { QueuesService } from './queues.service';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { QueueDto } from './dto/queue.dto';
import { FilterOperator } from 'src/common/filters.vm';
import { RoleGuard } from 'src/auth/role.guard';
import { UserDto } from 'src/users/dto/user.dto';
import { HasRole } from 'src/common/decorators';
import { EnrollQueueDto } from 'src/enroll-queues/dto/enroll-queue.dto';
import { StatisticQueueDto } from './dto/statistic-queue.dto';
/**
 * QueuesController class for queues controller with CRUD operations for queues
 */
@ApiTags('queues')
@Controller('/api/queues')
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
  createQueue(@Body() createQueueDto: CreateQueueDto) {
    return this.queuesService.create(createQueueDto);
  }

  /**
   *  Assign member into queue by id
   * @param id - id of queue to assign member
   * @param memberIds - array of member id to assign into queue
   * @returns QueueDto object with queue data after assign member
   */
  @Post('/:id/assign-member')
  @ApiBody({ type: [Number] })
  @ApiCreatedResponse({
    description: 'Assign member into queue successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  assignMember(
    @Param('id', ParseIntPipe) id: number,
    @Body() memberIds: number[],
  ) {
    return this.queuesService.assignMemberIntoQueue(id, memberIds);
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
  findAllQueue(@Query() search: any) {
    return this.queuesService.findAll(search);
  }
  /**
   * count Find all queues with search query params
   * @param search - search query params
   * @returns array of QueueDto objects with queues data
   * @throws {BadRequestException} - if search query params is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding queues
   */
  @Get('/count')
  @ApiQuery({
    name: 'search',
    required: false,
    type: FilterOperator,
    description: 'Search query',
  })
  @ApiOkResponse({ type: Number })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  countFindAllQueue(@Query() search: any) {
    return this.queuesService.countFindAll(search);
  }

  /**
   * Find all queues endpoint (GET /my-queues) with search query
   * @param search Search query from request query
   * @returns Array of event DTO objects
   */
  @Get('/my-queues')
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: true,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({ type: [QueueDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAllQueueUserCanSee(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('eventId', ParseIntPipe) eventId?: number,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.queuesService.findAllQueueUserCanSee(
      search,
      req.user.id,
      eventId,
      page,
      size,
    );
  }
  /**
   * count Find all queues endpoint (GET /my-queues) with search query
   * @param search Search query from request query
   * @returns Array of event DTO objects
   */
  @Get('/count/my-queues')
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'eventId',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'size',
    required: true,
    type: Number,
    example: 10,
  })
  @ApiOkResponse({ type: Number })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  countFindAllQueueUserCanSee(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('eventId', ParseIntPipe) eventId?: number,
    @Query('page') page?: number,
    @Query('size') size?: number,
  ) {
    return this.queuesService.countFindAllQueueUserCanSee(
      search,
      req.user.id,
      eventId,
      page,
      size,
    );
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
  findOneQueue(@Param('id', ParseIntPipe) id: number) {
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
  updateQueue(
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
  removeQueue(@Param('id', ParseIntPipe) id: number) {
    return this.queuesService.remove(+id);
  }

  // api get all user operate queue
  /**
   * Get all user operate queue
   * @param id  - id of queue to get all user operate queue
   * @returns  array of UserDto objects with user data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during getting all user operate queue
   */
  @Get('/:id/user-operate-queue')
  @ApiOkResponse({ type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getAllUserOperateQueue(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserDto[]> {
    return this.queuesService.getAllUserOperateQueue(id);
  }

  /**
   * gen url qrcode
   * @param id  - id of queue to gen url qrcode
   * @returns  url qrcode
   * @throws {BadRequestException} - if id is invalid
   */
  @Get('/:id/qrcode')
  @ApiOkResponse({ type: String })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getQrCode(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.queuesService.getQrCode(id);
  }

  /**
   * Get next enroll queue
   * @param id  - id of queue to get next enroll queue
   * @returns EnrollQueueDto object with enroll queue data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during getting next enroll queue
   * @throws {NotFoundException} - if queue with id not found
   */
  @Get('/:id/next-enroll-queue')
  @HasRole('admin')
  @ApiOkResponse({ type: EnrollQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  getNextEnrollQueue(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<EnrollQueueDto> {
    return this.queuesService.getNextEnrollQueue(id);
  }

  /**
   * get statistic queue
   * @param id  - id of queue to get statistic queue
   * @returns  StatisticQueueDto object with statistic queue data
   */
  @Get('/:id/statistic')
  @HasRole()
  @ApiOkResponse({ type: StatisticQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getStatisticQueue(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StatisticQueueDto> {
    return this.queuesService.getStatisticQueue(id);
  }
}
