import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateEnrollQueueDto } from './dto/create-enroll-queue.dto';
import { UpdateEnrollQueueDto } from './dto/update-enroll-queue.dto';
import { EnrollQueuesRepository } from './enroll-queues.repository';
import { LoggerService } from 'src/logger/logger.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { QueuesRepository } from 'src/queues/queues.repository';
import { EnrollQueue } from './entities/enroll-queue.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { EnrollQueueEnum } from 'src/common/enum';
import { plainToInstance } from 'class-transformer';
import { EnrollQueueDto } from './dto/enroll-queue.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { Equal, FindOptionsOrder } from 'typeorm';

@Injectable()
export class EnrollQueuesService {
  constructor(
    private readonly enrollQueueRepository: EnrollQueuesRepository,
    // private readonly enrollQueue: EventsRepository,
    private readonly log: LoggerService,
    private readonly sessionsService: SessionsService,
    private readonly queuesRepository: QueuesRepository,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  /**
   *  Create enroll queue for user public
   * @param createEnrollQueueDto  dto for create enroll queue
   * @returns
   */
  async create(createEnrollQueueDto: CreateEnrollQueueDto) {
    // check exist queueCode
    const existQueue = await this.queuesRepository.findOne({
      where: { code: createEnrollQueueDto.queueCode },
    });
    if (!existQueue) {
      throw new BadRequestException(
        'Queue với mã code ' +
          createEnrollQueueDto.queueCode +
          ' không tồn tại',
      );
    }
    // check and get sessionId from sesionsService
    const sessionId = await this.sessionsService.createOrRetrieve();

    // check exist enrollInQueue
    const existEnrollQueue = await this.enrollQueueRepository.findOne({
      where: { queue: { id: existQueue.id }, session: { id: sessionId } },
    });
    if (existEnrollQueue) {
      return plainToInstance(EnrollQueueDto, existEnrollQueue, {
        excludeExtraneousValues: true,
      });
    }

    // not exist create enrollQueue

    const newEnrollQueue = new EnrollQueue();
    newEnrollQueue.note = createEnrollQueueDto.note;
    newEnrollQueue.queue = existQueue;
    newEnrollQueue.session = new Session();
    newEnrollQueue.session.id = sessionId;
    // default is pending
    // newEnrollQueue.status = EnrollQueueEnum.PENDING;
    newEnrollQueue.enrollTime = new Date();
    const result = await this.enrollQueueRepository.save(newEnrollQueue);
    return plainToInstance(EnrollQueueDto, result, {
      excludeExtraneousValues: true,
    });

    // return 'This action adds a new enrollQueue';
  }

  /**
   * get all by sessionId
   * @returns list enroll queue of user
   */
  async findMyAll() {
    const sessionId = await this.sessionsService.createOrRetrieve();
    // find enrollqueue by sessionId
    const result = await this.enrollQueueRepository.find({
      where: { session: { id: sessionId } },
      relations: ['queue', 'queue.event'],
    });
    return result.map((item) =>
      plainToInstance(EnrollQueueDto, item, { excludeExtraneousValues: true }),
    );
  }

  /**
   *  get all by queueId can access by admin
   * @param queueId queueId want to view
   * @param status status of enroll queue
   * @param sort sort enroll queue
   * @returns list enroll queue of queueId
   */
  async findAll(queueId: number, status?: string, sort?: string) {
    // find enrollqueue by queueId
    // TODO: check role of user can action this queue
    // create payload
    const payload = {
      queue: { id: Equal(queueId) },
    };
    if (status) {
      payload['status'] = Equal(status);
    }

    const sortObj: FindOptionsOrder<EnrollQueue> = {
      enrollTime: 'ASC',
    };
    if (sort) {
      const sortArr = sort.split(',');
      sortArr.forEach((item) => {
        const itemArr = item.split(':');
        sortObj[itemArr[0]] = itemArr[1];
      });
    }

    const result = await this.enrollQueueRepository.find({
      where: { ...payload },
      relations: ['queue'],
      order: sortObj,
    });
    return result.map((item) =>
      plainToInstance(EnrollQueueDto, item, { excludeExtraneousValues: true }),
    );
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} enrollQueue`;
  // }

  // update(id: number, updateEnrollQueueDto: UpdateEnrollQueueDto) {
  //   return `This action updates a #${id} enrollQueue`;
  // }

  /**
   *  delete enroll queue
   * @param id id of enroll queue
   * @returns  delete enroll queue
   */
  async remove(id: string) {
    // check has role admin
    if (this.request.user) {
      const userInRequest = this.request.user as any;
      if (userInRequest?.role && userInRequest?.role === 'admin') {
        // can delete
        // TODO: check admin of event contain this queue
        this.log.debug('admin can delete enrollQueue');
        return this.enrollQueueRepository.delete({ id: id });
      }
    }
    // check is owner by sessionId
    const sessionId = await this.sessionsService.createOrRetrieve();
    const enrollQueue = await this.enrollQueueRepository.findOne({
      where: { id: id, session: { id: sessionId } },
    });
    if (enrollQueue) {
      return this.enrollQueueRepository.delete({ id: id });
    }
    throw new BadRequestException('Bạn không thể xóa số thứ tự này');
  }
}
