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
  UseGuards,
  ParseUUIDPipe,
  Put,
} from '@nestjs/common';
import { EnrollQueuesService } from './enroll-queues.service';
import { CreateEnrollQueueDto } from './dto/create-enroll-queue.dto';
import { UpdateEnrollQueueDto } from './dto/update-enroll-queue.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EnrollQueueDto } from './dto/enroll-queue.dto';
import { FilterOperator } from 'src/common/filters.vm';
import { RoleGuard } from 'src/auth/role.guard';
import { HasRole } from 'src/common/decorators';
import { EnrollQueueEnum } from 'src/common/enum';
import { PaginateDto } from 'src/common/paginate.dto';

// TODO: add number of people in queue

@ApiTags('enroll-queues')
@Controller('/api/enroll-queues')
@UseGuards(RoleGuard)
export class EnrollQueuesController {
  constructor(private readonly enrollQueuesService: EnrollQueuesService) {}

  /**
   *  Create enroll queue for user public
   * @param createEnrollQueueDto  dto for create enroll queue
   * @returns
   */
  @Post()
  @HasRole()
  @ApiCreatedResponse({ description: 'Created' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  createEnrollQueue(
    @Body() createEnrollQueueDto: CreateEnrollQueueDto,
    @Query('h') h: string,
  ) {
    return this.enrollQueuesService.create(
      createEnrollQueueDto,
      decodeURIComponent(h),
    );
  }

  /**
   *  get All enroll queue for user public
   * @returns list enroll queue of user
   */
  @Get('/my-enroll')
  @HasRole()
  @ApiOkResponse({ type: [EnrollQueueDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAllMyEnrollQueue() {
    return this.enrollQueuesService.findMyAll();
  }

  /**
   * get All enroll queue for user public
   * @param queueId id of queue want to view
   * @param status status of enroll queue
   * @param sort sort of enroll queue
   * @returns list enroll queue of user
   */
  @Get()
  @ApiOkResponse({ type: [EnrollQueueDto] })
  @ApiQuery({ name: 'queueId', required: true })
  @ApiQuery({ name: 'status', required: false, enum: EnrollQueueEnum })
  @ApiQuery({ name: 'sort', required: false, example: 'id:ASC' })
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
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @HasRole('admin')
  findAllEnrollQueue(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('queueId') queueId: number,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ): Promise<PaginateDto<EnrollQueueDto>> {
    return this.enrollQueuesService.findAll(page, size, queueId, status, sort);
  }

  // @Get(':id')
  // @ApiOkResponse({ type: EnrollQueueDto })
  // @ApiBadRequestResponse({ description: 'Bad Request' })
  // @ApiNotFoundResponse({ description: 'Not Found' })
  // findOneEnrollQueue(@Param('id', ParseIntPipe) id: number) {
  //   return this.enrollQueuesService.findOne(+id);
  // }

  // @Patch(':id')
  // @ApiOkResponse({ type: EnrollQueueDto })
  // @ApiBadRequestResponse({ description: 'Bad Request' })
  // @ApiNotFoundResponse({ description: 'Not Found' })
  // updateEnrollQueue(
  //   @Param('id', ParseIntPipe) id: number,

  //   @Body() updateEnrollQueueDto: UpdateEnrollQueueDto,
  // ) {
  //   return this.enrollQueuesService.update(+id, updateEnrollQueueDto);
  // }

  /**
   *  delete enroll queue for user public
   * @param id id of enroll queue
   * @returns
   */
  @HasRole('admin')
  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  removeEnrollQueue(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollQueuesService.remove(id);
  }
  /**
   *  delete enroll queue for user public
   * @param id id of enroll queue
   * @returns
   */
  @HasRole()
  @Delete(':id/myEnroll')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  removeMyEnrollQueue(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollQueuesService.remove(id);
  }

  /**
   * update status of enroll queue
   * @param id id of enroll queue
   * @param updateEnrollQueueDto dto for update status
   * @returns
   * */
  @HasRole('admin')
  @Put('/status/:id/finish')
  @ApiOkResponse({ type: EnrollQueueDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiQuery({ name: 'status', required: true, enum: EnrollQueueEnum })
  updateStatusEnrollQueue(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('status') status: EnrollQueueEnum,
  ) {
    return this.enrollQueuesService.updateStatus(id, status);
  }
}
