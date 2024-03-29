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
  Not,
  Repository,
} from 'typeorm';
import {
  getRandomQueueCode,
  handleValidateHashQueue,
} from 'src/common/algorithm';
import * as moment from 'moment';
import { QueuesService } from 'src/queues/queues.service';
import { EnrollQueueEnum, QueueEnum } from 'src/common/enum';
import _ from 'lodash';
import { CacheKey } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { SessionsRepository } from 'src/sessions/sessions.repository';

@Injectable()
export class EnrollQueuesService {
  constructor(
    private readonly enrollQueueRepository: EnrollQueuesRepository,
    // private readonly enrollQueue: EventsRepository,
    private readonly log: LoggerService,
    private readonly sessionsService: SessionsService,
    private readonly sessionRepository: SessionsRepository,
    private readonly queuesRepository: QueuesRepository,
    @Inject(REQUEST) private readonly request: Request,
    private readonly queuesService: QueuesService,
    private readonly queueRepository: QueuesRepository,
  ) {}

  /**
   *  Create enroll queue for user public
   * @param createEnrollQueueDto  dto for create enroll queue
   * @returns
   */
  async create(
    tmpSession: string,
    createEnrollQueueDto: CreateEnrollQueueDto,
    q: string,
    uxTime: number,
    h: string,
  ) {
    // check exist queueCode
    const existQueue = await this.queuesRepository.findOne({
      where: {
        code: createEnrollQueueDto.queueCode,
        event: {
          status: true,
        },
      },
    });
    if (!existQueue) {
      this.log.error(
        'Queue với mã code ' +
          createEnrollQueueDto.queueCode +
          ' không tồn tại',
      );
      throw new BadRequestException(
        'Hàng đợi không tồn tại hoặc đã bị khóa, vui lòng thử lại sau',
      );
    }
    // check hash queue random
    const [encryptText, hashQueue] = handleValidateHashQueue(
      existQueue.randomCode,
      uxTime.toString(),
      h,
    );

    // check have hash queue and time valid
    if (!encryptText || !hashQueue || !uxTime || encryptText !== hashQueue) {
      this.log.error('Hash queue không hợp lệ');
      throw new BadRequestException('Mã QR không hợp lệ');
    }

    // check time valid
    if (new Date().getTime() > new Date(uxTime).getTime()) {
      const randomCodeQueue = getRandomQueueCode();
      await this.queuesRepository.update(existQueue.id, {
        ...existQueue,
        randomCode: randomCodeQueue,
      });
      this.log.error('Thời gian QR đã hết hạn, Hash queue đã hết hạn');
      throw new BadRequestException('Mã QR không hợp lệ');
    }

    // check and get sessionId from sesionsService
    let sessionId = tmpSession;
    if (!sessionId) {
      sessionId = await this.sessionsService.createOrRetrieve();
    }
    if (!sessionId) {
      this.log.error('Không thể tạo hoặc lấy được session');
      throw new BadRequestException(
        'Có lỗi trong quá trình lấy số thứ tự, vui lòng thử lại sau',
      );
    }

    // check exist sessionId, if not exist => create new session and get sessionId and set cookie
    if (sessionId) {
      const existSession = await this.sessionRepository.findOne({
        where: { id: sessionId },
      });
      if (!existSession) {
        // create new
        const newSession = new Session();
        newSession.id = sessionId;
        newSession.browser = this.request.headers['user-agent'];

        const result = await this.sessionRepository.save(newSession);
        if (!result) {
          throw new BadRequestException(
            'Có lỗi trong quá trình lấy số thứ tự, vui lòng thử lại sau',
          );
        }
      }
    }
    // check exist enrollInQueue
    const existEnrollQueue = await this.enrollQueueRepository.findOne({
      where: {
        status: Not(Equal(EnrollQueueEnum.DONE)),
        queue: {
          id: existQueue.id,
          status: Not(Equal(EnrollQueueEnum.BLOCKED)),
          event: {
            status: true,
          },
        },
        session: { id: sessionId },
      },
    });
    if (existEnrollQueue) {
      return plainToInstance(EnrollQueueDto, existEnrollQueue, {
        excludeExtraneousValues: true,
      });
    }

    const sequenceNumberCurrent = await this.enrollQueueRepository.findOne({
      where: { queue: { id: existQueue.id } },
      order: {
        sequenceNumber: 'DESC',
      },
    });

    // not exist create enrollQueue

    const newEnrollQueue = new EnrollQueue();
    newEnrollQueue.note = createEnrollQueueDto.note;
    newEnrollQueue.queue = existQueue;
    newEnrollQueue.session = new Session();
    newEnrollQueue.session.id = sessionId;
    newEnrollQueue.sequenceNumber =
      (sequenceNumberCurrent ? sequenceNumberCurrent.sequenceNumber : 0) + 1;

    // default is pending
    // newEnrollQueue.status = EnrollQueueEnum.PENDING;
    newEnrollQueue.enrollTime = new Date();
    const result = await this.enrollQueueRepository.save(newEnrollQueue);
    if (!result) {
      throw new BadRequestException(
        'Có lỗi trong quá trình lấy số thứ tự, vui lòng thử lại sau',
      );
    }

    // change random queue code after create enroll queue last

    // get new
    // if setup dynamic and allow mode onetime => change randomCode
    if (result && existQueue.isDynamic && existQueue.isOneTime) {
      const randomCodeQueue = getRandomQueueCode();
      // update randomCode for queue
      await this.queueRepository.update(existQueue.id, {
        ...existQueue,

        randomCode: randomCodeQueue,
      });
    }

    return plainToInstance(EnrollQueueDto, result, {
      excludeExtraneousValues: true,
    });

    // return 'This action adds a new enrollQueue';
  }

  /**
   * get all by sessionId
   * @returns list enroll queue of user
   */
  async findMyAll(tmpSession: string | null | undefined) {
    // get sessionId from cookie
    const sessionId = tmpSession
      ? tmpSession
      : await this.sessionsService.createOrRetrieve();
    // find enrollqueue by sessionId
    const result = await this.enrollQueueRepository.find({
      where: {
        session: { id: sessionId },
        queue: {
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
          },
        },
      },
      relations: ['queue', 'queue.event'],
    });
    const enrollQueuesDTO = result.map((item) =>
      plainToInstance(EnrollQueueDto, item, { excludeExtraneousValues: true }),
    );
    const newArr = [];
    for (let i = 0; i < enrollQueuesDTO.length; i++) {
      // get current serve or pending in queue and get first

      if (enrollQueuesDTO[i].status === EnrollQueueEnum.PENDING) {
        // queue pending/ waiting -> done cuoi cung
        // queue serving -> serving cuoi cung
        let getCurrentServeInQueue;
        // nếu hàng đợi đang đợi hoặc không có người thì lấy stt đã done trước đó
        if (
          enrollQueuesDTO[i].queue.status === QueueEnum.PENDING ||
          enrollQueuesDTO[i].queue.status === QueueEnum.WAITING
        ) {
          getCurrentServeInQueue = await this.enrollQueueRepository.findOne({
            where: {
              queue: {
                id: enrollQueuesDTO[i].queue.id,
                status: Not(Equal(QueueEnum.IS_CLOSED)),
              },
              status: EnrollQueueEnum.DONE,
              sequenceNumber: LessThan(enrollQueuesDTO[i].sequenceNumber),
            },
            order: { sequenceNumber: 'DESC' },
          });
        }
        // nếu hàng đợi đang phục vụ thì lấy current serve
        if (enrollQueuesDTO[i].queue.status === QueueEnum.SERVING) {
          getCurrentServeInQueue = await this.enrollQueueRepository.findOne({
            where: {
              queue: {
                id: enrollQueuesDTO[i].queue.id,
                status: Not(Equal(QueueEnum.IS_CLOSED)),
              },
              status: EnrollQueueEnum.SERVING,
              sequenceNumber: LessThan(enrollQueuesDTO[i].sequenceNumber),
            },
            order: { sequenceNumber: 'DESC' },
          });
        }

        if (getCurrentServeInQueue) {
          enrollQueuesDTO[i].currentQueue =
            getCurrentServeInQueue?.sequenceNumber;
        } else {
          enrollQueuesDTO[i].currentQueue = 0;
        }
        const statisticQueueDto = await this.queuesService.getStatisticQueue(
          enrollQueuesDTO[i].queue.code,
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
        enrollQueuesDTO[i].serveTimeAvg = Math.floor(
          statisticQueueDto?.timeServeAvg || 0,
        );
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
    queueCode: string,
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
                code: Equal(queueCode),
                event: {
                  status: true,
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
                code: Equal(queueCode),
                users: {
                  id: In([userInRequest.id]),
                },
              },
            ],
          },
        ],
        relations: ['queue'],
        order: sortObj,
        take: size,
        skip: (page - 1) * size,
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
                status: true,
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

    /**
     *  // get enroll queue by id
    const enrollQueue = await this.enrollQueueRepository.findOne({
      where: { id: id },
      relations: ['queue'],
    });
    if (!enrollQueue) {
      throw new BadRequestException('Không tìm thấy số thứ tự này');
    }
    // get all enroll queue have sequence number less than enrollQueue and status is serving
    const getEnrollQueueLessThan = await this.enrollQueueRepository.find({
      where: {
        queue: { id: enrollQueue.queue.id },
        status: EnrollQueueEnum.SERVING,
        sequenceNumber: LessThanOrEqual(enrollQueue.sequenceNumber),
      },
      order: { sequenceNumber: 'DESC' },
    });
    // update all enroll queue in list getEnrollQueueLessThan to done
    const updateEnrollQueue = getEnrollQueueLessThan.map((item) => {
      item.status = EnrollQueueEnum.DONE;
      return item;
    });
    await this.enrollQueueRepository.save(updateEnrollQueue);
     */
  }
}
