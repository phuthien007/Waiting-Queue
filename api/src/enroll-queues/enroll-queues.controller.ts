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
  Req,
  BadRequestException,
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
import { EnrollQueueEnum, RoleEnum } from 'src/common/enum';
import { PaginateDto } from 'src/common/paginate.dto';
import { Request } from 'express';

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
    @Req() req: Request,
    @Body() createEnrollQueueDto: CreateEnrollQueueDto,
    // random queue code
    @Query('q') q: string,
    // uxTime
    @Query('uxTime') uxTime: number,
    // hash
    @Query('h') h: string,
  ) {
    return this.enrollQueuesService.create(
      req.cookies?.sessionId,
      createEnrollQueueDto,
      q,
      uxTime,
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
  findAllMyEnrollQueue(@Req() req: Request) {
    return this.enrollQueuesService.findMyAll(req.cookies?.sessionId);
  }

  /**
   * get All enroll queue for user public
   * @param queueCode id of queue want to view
   * @param status status of enroll queue
   * @param sort sort of enroll queue
   * @returns list enroll queue of user
   */
  @Get()
  @ApiOkResponse({ type: [EnrollQueueDto] })
  @ApiQuery({ name: 'queueCode', required: true })
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
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  findAllEnrollQueue(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('queueCode') queueCode: string,
    @Query('status') status?: string,
    @Query('sort') sort?: string,
  ): Promise<PaginateDto<EnrollQueueDto>> {
    return this.enrollQueuesService.findAll(
      page,
      size,
      queueCode,
      status,
      sort,
    );
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
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
  @Delete(':id')
  @ApiOkResponse({ description: 'OK' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  removeEnrollQueue(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollQueuesService
      .remove(id)
      .then((res) => {
        return true;
      })
      .catch((err) => {
        throw new BadRequestException('Không thể xóa');
      });
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
  @HasRole(RoleEnum.ADMIN, RoleEnum.OPERATOR)
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
