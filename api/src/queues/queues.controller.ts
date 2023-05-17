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
  BadRequestException,
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
import { RoleEnum } from 'src/common/enum';
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
  @HasRole(RoleEnum.ADMIN)
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
  @Post('/:queueCode/assign-member')
  @HasRole(RoleEnum.ADMIN)
  @ApiBody({ type: [Number] })
  @ApiCreatedResponse({
    description: 'Assign member into queue successfully',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  assignMember(
    @Param('queueCode') queueCode: string,
    @Body() memberIds: number[],
  ) {
    return this.queuesService.assignMemberIntoQueue(queueCode, memberIds);
  }

  /**
   * Find all queues with search query params
   * @param search - search query params
   * @returns array of QueueDto objects with queues data
   * @throws {BadRequestException} - if search query params is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding queues
   */
  @Get()
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
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
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
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
  @HasRole(RoleEnum.OPERATOR, RoleEnum.ADMIN)
  @ApiQuery({
    name: 'eventId',
    required: false,
    type: String,
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
    @Query('eventId') eventId?: string,
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
    type: String,
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
  @HasRole(RoleEnum.OPERATOR, RoleEnum.ADMIN)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  countFindAllQueueUserCanSee(
    @Req() req: any,
    @Query('search') search?: string,
    @Query('eventId') eventId?: string,
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
  @Get(':queueCode')
  @ApiOkResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  findOneQueue(@Param('queueCode') queueCode: string) {
    return this.queuesService.findOne(queueCode);
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
  @Patch(':queueCode')
  @ApiOkResponse({ type: QueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HasRole(RoleEnum.ADMIN)
  updateQueue(
    @Param('queueCode') queueCode: string,
    @Body() updateQueueDto: UpdateQueueDto,
  ) {
    return this.queuesService.update(queueCode, updateQueueDto);
  }

  /**
   * Delete queue by id
   * @param id - id of queue to delete
   * @returns  QueueDto object with deleted queue data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during deleting queue
   * @throws {NotFoundException} - if queue with id not found
   */
  @Delete(':queueCode')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @HasRole(RoleEnum.ADMIN)
  removeQueue(@Param('queueCode') queueCode: string) {
    return this.queuesService
      .remove(queueCode)
      .then((res) => {
        return true;
      })
      .catch((err) => {
        throw new BadRequestException('Không thể xóa');
      });
  }

  // api get all user operate queue
  /**
   * Get all user operate queue
   * @param id  - id of queue to get all user operate queue
   * @returns  array of UserDto objects with user data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during getting all user operate queue
   */
  @Get('/:queueCode/user-operate-queue')
  @ApiOkResponse({ type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HasRole(RoleEnum.OPERATOR, RoleEnum.ADMIN)
  getAllUserOperateQueue(
    @Param('queueCode') queueCode: string,
  ): Promise<UserDto[]> {
    return this.queuesService.getAllUserOperateQueue(queueCode);
  }

  /**
   * gen url qrcode
   * @param id  - id of queue to gen url qrcode
   * @returns  url qrcode
   * @throws {BadRequestException} - if id is invalid
   */
  @Get('/:queueCode/qrcode')
  @ApiOkResponse({ type: String })
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getQrCode(@Param('queueCode') queueCode: string): Promise<string> {
    return this.queuesService.getQrCode(queueCode);
  }

  /**
   * Get next enroll queue
   * @param id  - id of queue to get next enroll queue
   * @returns EnrollQueueDto object with enroll queue data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during getting next enroll queue
   * @throws {NotFoundException} - if queue with id not found
   */
  @Get('/:queueCode/next-enroll-queue')
  @HasRole(RoleEnum.OPERATOR, RoleEnum.ADMIN)
  @ApiOkResponse({ type: EnrollQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  getNextEnrollQueue(
    @Param('queueCode') queueCode: string,
  ): Promise<EnrollQueueDto> {
    return this.queuesService.getNextEnrollQueue(queueCode);
  }

  /**
   * get statistic queue
   * @param id  - id of queue to get statistic queue
   * @returns  StatisticQueueDto object with statistic queue data
   */
  @Get('/:queueCode/statistic')
  @HasRole()
  @ApiOkResponse({ type: StatisticQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getStatisticQueue(
    @Param('queueCode') queueCode: string,
  ): Promise<StatisticQueueDto> {
    return this.queuesService.getStatisticQueue(queueCode);
  }
}
