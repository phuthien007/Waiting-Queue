import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { FilterOperator } from 'src/common/filters.vm';
import { PaginateDto } from 'src/common/paginate.dto';
import { LoggerService } from 'src/logger/logger.service';
import { QueuesRepository } from 'src/queues/queues.repository';
import { Session } from 'src/sessions/entities/session.entity';
import { SessionsService } from 'src/sessions/sessions.service';
import { CreateEnrollQueueDto } from './dto/create-enroll-queue.dto';
import { EnrollQueueDto } from './dto/enroll-queue.dto';
import { EnrollQueuesRepository } from './enroll-queues.repository';
import { EnrollQueue } from './entities/enroll-queue.entity';
import {
  Equal,
  FindOptionsOrder,
  In,
  LessThan,
  LessThanOrEqual,
} from 'typeorm';
import {
  getRandomQueueCode,
  handleValidateHashQueue,
} from 'src/common/algorithm';
import * as moment from 'moment';
import { QueuesService } from 'src/queues/queues.service';
import { EnrollQueueEnum } from 'src/common/enum';
import _ from 'lodash';

@Injectable()
export class EnrollQueuesService {
  constructor(
    private readonly enrollQueueRepository: EnrollQueuesRepository,
    // private readonly enrollQueue: EventsRepository,
    private readonly log: LoggerService,
    private readonly sessionsService: SessionsService,
    private readonly queuesRepository: QueuesRepository,
    @Inject(REQUEST) private readonly request: Request,
    private readonly queuesService: QueuesService,
  ) {}

  /**
   *  Create enroll queue for user public
   * @param createEnrollQueueDto  dto for create enroll queue
   * @returns
   */
  async create(
    createEnrollQueueDto: CreateEnrollQueueDto,
    q: string,
    uxTime: string,
    h: string,
  ) {
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
    // check hash queue random
    const [encryptText, hashQueue] = handleValidateHashQueue(
      existQueue.randomCode,
      uxTime,
      h,
    );
    console.log(encryptText, hashQueue, uxTime, q, h);
    // check have hash queue and time valid
    if (!encryptText || !hashQueue || !uxTime || encryptText !== hashQueue) {
      throw new BadRequestException('Hash queue không hợp lệ');
    }

    // check time valid
    if (moment().isBefore(moment().from(uxTime))) {
      const randomCodeQueue = getRandomQueueCode();
      await this.queuesRepository.update(existQueue.id, {
        ...existQueue,
        randomCode: randomCodeQueue,
      });
      throw new BadRequestException('Hash queue đã hết hạn');
    }

    // check and get sessionId from sesionsService
    const sessionId = await this.sessionsService.createOrRetrieve();
    if (!sessionId) {
      throw new BadRequestException('Không thể tạo hoặc lấy được session');
    }
    // check exist enrollInQueue
    const existEnrollQueue = await this.enrollQueueRepository.findOne({
      where: { queue: { id: existQueue.id }, session: { id: sessionId } },
    });
    if (existEnrollQueue) {
      return plainToInstance(EnrollQueueDto, existEnrollQueue, {
        excludeExtraneousValues: true,
      });
    }

    const sequenceNumberCurrent = await this.enrollQueueRepository.count({
      where: { queue: { id: existQueue.id } },
    });

    // not exist create enrollQueue

    const newEnrollQueue = new EnrollQueue();
    newEnrollQueue.note = createEnrollQueueDto.note;
    newEnrollQueue.queue = existQueue;
    newEnrollQueue.session = new Session();
    newEnrollQueue.session.id = sessionId;
    newEnrollQueue.sequenceNumber = sequenceNumberCurrent + 1;

    // default is pending
    // newEnrollQueue.status = EnrollQueueEnum.PENDING;
    newEnrollQueue.enrollTime = new Date();
    const result = await this.enrollQueueRepository.save(newEnrollQueue);

    // change random queue code after create enroll queue last

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

    const enrollQueuesDTO = result.map((item) =>
      plainToInstance(EnrollQueueDto, item, { excludeExtraneousValues: true }),
    );
    const newArr = [];
    for (let i = 0; i < enrollQueuesDTO.length; i++) {
      if (enrollQueuesDTO[i].status === EnrollQueueEnum.PENDING) {
        const statisticQueueDto = await this.queuesService.getStatisticQueue(
          enrollQueuesDTO[i].queue.id,
        );

        // count number sequence from current serving to this enroll queue
        const countSequence = await this.enrollQueueRepository.count({
          where: {
            queue: { id: enrollQueuesDTO[i].queue.id },
            sequenceNumber: LessThanOrEqual(enrollQueuesDTO[i].sequenceNumber),
            status: Equal(EnrollQueueEnum.PENDING),
          },
          order: { sequenceNumber: 'ASC' },
        });

        enrollQueuesDTO[i].willEnrollWhen = new Date(
          enrollQueuesDTO[i].enrollTime.getTime() +
            statisticQueueDto.timeWaitAvg * 1000 * countSequence,
        );
        enrollQueuesDTO[i].serveTimeAvg = statisticQueueDto?.timeServeAvg || 0;
        newArr.push(enrollQueuesDTO[i]);
        // return item;
      } else {
        newArr.push(enrollQueuesDTO[i]);
      }
    }

    return newArr;
  }

  /**
   *  get all by queueId can access by admin
   * @param queueId queueId want to view
   * @param status status of enroll queue
   * @param sort sort enroll queue
   * @returns list enroll queue of queueId
   */
  async findAll(
    page: number,
    size: number,
    queueId: number,
    status?: string,
    sort?: string,
  ): Promise<PaginateDto<EnrollQueueDto>> {
    // find enrollqueue by queueId

    const userInRequest = this.request.user as any;

    // create payload
    const payload = {};
    if (status) {
      payload['status'] = Equal(status);
    }

    const sortObj: FindOptionsOrder<EnrollQueue> = {
      sequenceNumber: 'ASC',
    };
    if (sort) {
      const sortArr = sort.split(',');
      sortArr.forEach((item) => {
        const itemArr = item.split(':');
        sortObj[itemArr[0]] = itemArr[1];
      });
    }

    // get enroll queue with queueId and event contain queue and same tenant
    const [enrollQueues, totalCount] =
      await this.enrollQueueRepository.findAndCount({
        where: [
          {
            ...payload,
            queue: [
              {
                id: Equal(queueId),
                event: {
                  user: {
                    tenant: {
                      tenantCode: userInRequest.tenantCode,
                    },
                    id: Equal(userInRequest.id),
                    role: 'admin',
                  },
                },
              },
              {
                id: Equal(queueId),
                users: {
                  id: In([userInRequest.id]),
                },
              },
            ],
          },
        ],
        relations: ['queue'],
        order: sortObj,
      });
    const result = enrollQueues.map((item) =>
      plainToInstance(EnrollQueueDto, item, { excludeExtraneousValues: true }),
    );
    return new PaginateDto<EnrollQueueDto>(
      result,
      page,
      size === result.length ? size : result.length,
      totalCount,
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
        this.log.debug('admin can delete enrollQueue');
        const existEnrollQueue = await this.enrollQueueRepository.findOne({
          where: {
            id: id,
            queue: {
              event: {
                user: {
                  tenant: {
                    tenantCode: userInRequest.tenantCode,
                  },
                },
              },
            },
          },
        });

        if (existEnrollQueue) {
          return this.enrollQueueRepository.delete({ id: id });
        }
      }
    } else {
      // check is owner by sessionId
      const sessionId = await this.sessionsService.createOrRetrieve();
      const enrollQueue = await this.enrollQueueRepository.findOne({
        where: { id: id, session: { id: sessionId } },
      });
      if (enrollQueue) {
        return this.enrollQueueRepository.delete({ id: id });
      }
    }
    throw new BadRequestException('Bạn không thể xóa số thứ tự này');
  }

  async updateStatus(id: string, status: string) {
    const enrollQueueUpdate = await this.enrollQueueRepository.update(
      { id: id },
      { status: status, endServe: new Date() },
    );
    return enrollQueueUpdate;
  }
}
