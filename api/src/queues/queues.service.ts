import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateQueueDto } from './dto/create-queue.dto';
import { UpdateQueueDto } from './dto/update-queue.dto';
import { QueuesRepository } from './queues.repository';
import { LoggerService } from 'src/logger/logger.service';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { EventsRepository } from 'src/events/events.repository';
import { plainToInstance } from 'class-transformer';
import { Queue } from './entities/queue.entity';
import { QueueDto } from './dto/queue.dto';
import { FilterOperator } from 'src/common/filters.vm';
import {
  createCodeQueue,
  getRandomQueueCode,
  handleHashQueue,
  partialMapping,
} from 'src/common/algorithm';
import { EnrollQueueEnum, QueueEnum, commonEnum } from 'src/common/enum';
import { Equal, In, Not } from 'typeorm';
import { UserDto } from 'src/users/dto/user.dto';
import { User } from 'src/users/entities/user.entity';
import { PaginateDto } from 'src/common/paginate.dto';
import { EnrollQueueDto } from 'src/enroll-queues/dto/enroll-queue.dto';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { EnrollQueuesRepository } from 'src/enroll-queues/enroll-queues.repository';
import * as moment from 'moment';
import { StatisticQueueDto } from './dto/statistic-queue.dto';
import _, { isSafeInteger, parseInt, toSafeInteger } from 'lodash';

/**
 * QueuesService class for queues service with CRUD operations for queues and other operations
 */
@Injectable()
export class QueuesService {
  constructor(
    private readonly queueRepository: QueuesRepository,
    private readonly eventRepository: EventsRepository,
    @Inject(REQUEST) private readonly request: Request,
    private readonly log: LoggerService,
    private readonly enrollQueueRepository: EnrollQueuesRepository,
  ) {}

  /**
   * Find queue by id with queue data
   * @param id - id of queue to find
   */
  async getQrCode(queueCode: string) {
    const queue = await this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
            tenant: {
              tenantCode: (this.request.user as any).tenantCode,
            },
          },
        },
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          users: {
            id: In([(this.request.user as any).id]),
          },
        },
      ],
    });
    if (!queue) {
      throw new NotFoundException('Không tìm thấy queue');
    }
    let hashQueue = '';
    let startTime = new Date().getTime();

    // if is not dynamic qrcode
    if (!queue.isDynamic) {
      if (
        queue.dateGetQrcode &&
        moment().isBefore(
          moment(queue.dateGetQrcode.getTime()).add(
            process.env.LONG_TIMEOUT_VERIFY,
            'seconds',
          ),
        )
      ) {
        startTime = queue.dateGetQrcode.getTime();
      } else {
        // need inital or update time get qrcode
        // change randomQueueCode
        const randomCodeQueue = getRandomQueueCode();
        queue.randomCode = randomCodeQueue;
        await this.queueRepository.save({
          ...queue,
          dateGetQrcode: new Date(),
          randomCode: randomCodeQueue,
        });
      }
    }
    const timeLong = toSafeInteger(process.env.LONG_TIMEOUT_VERIFY) * 86400;
    const uxTime =
      startTime +
      parseInt(
        queue.isDynamic ? process.env.TIMEOUT_VERIFY : timeLong.toString(),
      ) *
        1000;

    // if queue not have randomCode

    if (!queue.randomCode) {
      const randomCodeQueue = getRandomQueueCode();
      // update randomCode for queue
      await this.queueRepository.save({
        ...queue,
        randomCode: randomCodeQueue,
      });
      // handle hash queue
      hashQueue = handleHashQueue(randomCodeQueue, uxTime.toString());
    } else {
      hashQueue = handleHashQueue(queue.randomCode, uxTime.toString());
    }
    const url = `${process.env.CLIENT_URL}/public/queues/enroll?q=${
      queue.code
    }&t=${uxTime.toString()}&h=${encodeURIComponent(
      hashQueue.substring(0, 20),
    )}`;
    return url;
  }

  /**
   * Create a new queue with createQueueDto
   * @param createQueueDto - CreateQueueDto object from request body
   * @returns QueueDto object with created queue data
   */
  async create(createQueueDto: CreateQueueDto) {
    // check event exist in database
    const eventExist = await this.eventRepository.findOne({
      where: { id: createQueueDto.eventId, status: true },
    });

    if (!eventExist) {
      this.log.error('Event not found');
      throw new BadRequestException(
        transformError('Sự kiện', ERROR_TYPE.NOT_FOUND),
      );
    }

    // create queue

    const queue = plainToInstance(Queue, {
      ...createQueueDto,
    });

    queue.event = eventExist;

    queue.code = createCodeQueue();

    const savedQueue = await this.queueRepository.save(queue);
    return plainToInstance(QueueDto, savedQueue, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Find all queues with search query params
   * @param search - search query params
   * @returns array of QueueDto objects with queues data
   */
  async findAll(search: any): Promise<PaginateDto<QueueDto>> {
    // start create search
    const filterObj = new FilterOperator();
    // transform to filter
    Object.keys(search).forEach((key) => {
      if (key !== 'page' && key !== 'size' && key !== 'sort') {
        if (search[key] instanceof Array) {
          search[key].forEach((tmp: any) => {
            filterObj.addOperator(key, tmp);
          });
        } else {
          filterObj.addOperator(key, search[key]);
        }
      }
    });
    filterObj.sort = search?.sort;

    let queues: Queue[] = [];
    let totalCount: number;
    // split event filter
    const eventFilter = (filterObj.transformToQuery() as any)?.event;
    // delete event filter
    delete (filterObj.transformToQuery() as any)?.event;
    try {
      [queues, totalCount] = await this.queueRepository.findAndCount({
        relations: ['event'],
        where: [
          {
            ...filterObj.transformToQuery(),
            status: Not(Equal(QueueEnum.IS_CLOSED)),
            event: {
              ...eventFilter,
              status: true,
              tenant: {
                tenantCode: (this.request.user as any).tenantCode,
              },
            },
          },
          {
            ...filterObj.transformToQuery(),
            status: Not(Equal(QueueEnum.IS_CLOSED)),
            users: {
              id: In([(this.request.user as any).id]),
            },
          },
        ],
        order: filterObj.parseSortToOrder(),
        take: search.size,
        skip: (search.page - 1) * search.size,
      });
    } catch (error) {
      this.log.error(error);

      throw new BadRequestException(
        transformError(
          `Search: ${JSON.stringify(search)}`,
          ERROR_TYPE.IN_VALID,
        ),
      );
    }
    const result = queues.map((queue: Queue) =>
      plainToInstance(QueueDto, queue, {
        excludeExtraneousValues: true,
      }),
    );
    return new PaginateDto<QueueDto>(
      result,
      search.page,
      result.length === search.size ? search.size : result.length,
      totalCount,
    );
  }
  /**
   * count Find all queues with search query params
   * @param search - search query params
   * @returns array of QueueDto objects with queues data
   */
  async countFindAll(search: any): Promise<number> {
    // start create search
    const filterObj = new FilterOperator();
    // transform to filter
    Object.keys(search).forEach((key) => {
      if (key !== 'page' && key !== 'size' && key !== 'sort') {
        if (search[key] instanceof Array) {
          search[key].forEach((tmp: any) => {
            filterObj.addOperator(key, tmp);
          });
        } else {
          filterObj.addOperator(key, search[key]);
        }
      }
    });

    let totalCount: number;
    const userInReq = this.request.user as any;
    try {
      totalCount = await this.queueRepository.count({
        relations: ['event'],
        where: {
          event: {
            status: true,

            tenant: {
              tenantCode: userInReq.tenantCode,
            },
          },
        },
      });
    } catch (error) {
      this.log.error(error);

      throw new BadRequestException(
        transformError(
          `Search: ${JSON.stringify(search)}`,
          ERROR_TYPE.IN_VALID,
        ),
      );
    }

    return totalCount;
  }

  /**
   * Find a queue by id
   * @param queueCode - queueCode of queue
   * @returns QueueDto object with queue data
   * @throws NotFoundException if queue not found
   */
  async findOne(queueCode: string) {
    const queue = await this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
            tenant: {
              tenantCode: (this.request.user as any).tenantCode,
            },
          },
        },
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          users: {
            id: In([(this.request.user as any).id]),
          },
        },
      ],
      relations: ['event'],
    });
    if (!queue)
      throw new NotFoundException(
        transformError(`Id: ${queueCode}`, ERROR_TYPE.NOT_FOUND),
      );
    return plainToInstance(QueueDto, queue, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update a queue by id
   * @param id  - id of queue
   * @param updateQueueDto  - UpdateQueueDto object from request body
   * @returns   QueueDto object with updated queue data
   * @throws NotFoundException if queue not found
   */
  async update(queueCode: string, updateQueueDto: UpdateQueueDto) {
    let data = await this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
            tenant: {
              tenantCode: (this.request.user as any).tenantCode,
            },
          },
        },
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          users: {
            id: In([(this.request.user as any).id]),
          },
        },
      ],
    });
    if (!data) {
      throw new NotFoundException(
        transformError(`QueueCode: ${queueCode}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    if (updateQueueDto.eventId) {
      const eventExist = await this.eventRepository.findOne({
        where: {
          id: updateQueueDto.eventId,
          status: true,
          tenant: { tenantCode: (this.request.user as any).tenantCode },
        },
      });

      if (!eventExist) {
        this.log.error('Event not found');
        throw new BadRequestException(
          transformError('Sự kiện', ERROR_TYPE.NOT_FOUND),
        );
      }

      data.event = eventExist;
    }
    updateQueueDto.id = data.id;
    updateQueueDto.createdAt = data.createdAt;
    updateQueueDto.updatedAt = new Date();
    data = partialMapping(data, updateQueueDto) as Queue;

    // when update dynamic => reset dateGetQrcode
    if (data.isDynamic) {
      data.dateGetQrcode = null;
    }

    return plainToInstance(QueueDto, this.queueRepository.save(data), {
      excludeExtraneousValues: true,
    });
  }

  /**
   *  Remove a queue by id
   * @param id  - id of queue
   * @returns  QueueDto object with removed queue data
   */
  async remove(queueCode: string) {
    const existQueue = await this.queueRepository.findOne({
      where: {
        code: queueCode,
        status: Not(Equal(QueueEnum.IS_CLOSED)),
        event: {
          status: true,
          tenant: {
            tenantCode: (this.request.user as any).tenantCode,
          },
        },
      },
    });
    if (!existQueue) {
      throw new NotFoundException(
        transformError(`QueueCode: ${queueCode}`, ERROR_TYPE.NOT_FOUND),
      );
    }
    return this.queueRepository.delete(existQueue.id);
  }

  /**
   * assign member into queue by queueId and memberIds
   * @param queueId - id of queue want to assign
   * @param memberIds - array of member id want to assign
   * @returns void
   */
  async assignMemberIntoQueue(queueCode: string, memberIds: number[]) {
    // check exist queue isClose in database
    const queueExist = await this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
            tenant: {
              tenantCode: (this.request.user as any).tenantCode,
            },
          },
        },
      ],
    });

    if (!queueExist || queueExist.status === QueueEnum.IS_CLOSED) {
      this.log.error('Queue not found');
      throw new BadRequestException(
        transformError('Hàng đợi', ERROR_TYPE.NOT_FOUND),
      );
    }

    return this.queueRepository.assignMemberIntoQueue(queueExist.id, memberIds);
  }

  /**
   * get user operate queue by queueId
   * @param queueId - id of queue want to get user operate
   * @returns array of UserDto objects with user data
   * @throws NotFoundException if queue not found
   * @throws BadRequestException if queue is closed
   */
  async getAllUserOperateQueue(queueCode: string): Promise<UserDto[]> {
    const queue = await this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
            tenant: {
              tenantCode: (this.request.user as any).tenantCode,
            },
          },
        },
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          users: {
            id: In([(this.request.user as any).id]),
          },
        },
      ],
      relations: ['users'],
    });

    if (!queue) {
      throw new NotFoundException(
        transformError(`QueueCode: ${queueCode}`, ERROR_TYPE.NOT_FOUND),
      );
    }
    const listUser: UserDto[] = queue.users.map((user: User) =>
      plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
    return listUser;
  }

  /**
   * get all queue user can see
   * @param search - search query params
   * @param userId - id of user
   * @param eventId - id of event
   * @returns array of QueueDto objects with queues data
   * @throws BadRequestException if search query params is invalid
   * @throws NotFoundException if event not found
   */
  async findAllQueueUserCanSee(
    search: string,
    userId: number,
    eventId: string,
    page: number,
    size: number,
  ): Promise<PaginateDto<QueueDto>> {
    let queues: Queue[] = [];
    let totalCount: number;
    try {
      [queues, totalCount] = await this.queueRepository.queueUserCanSee(
        search,
        userId,
        eventId,
        page,
        size,
      );
    } catch (error) {
      this.log.error(error);

      throw new BadRequestException(
        transformError(
          `Search: ${JSON.stringify(search)}`,
          ERROR_TYPE.IN_VALID,
        ),
      );
    }

    const result = queues.map((queue: Queue) =>
      plainToInstance(QueueDto, queue, {
        excludeExtraneousValues: true,
      }),
    );

    return new PaginateDto<QueueDto>(
      result,
      page,
      result.length === size ? size : result.length,
      totalCount,
    );
  }
  /**
   * count get all queue user can see
   * @param search - search query params
   * @param userId - id of user
   * @param eventId - id of event
   * @returns array of QueueDto objects with queues data
   * @throws BadRequestException if search query params is invalid
   * @throws NotFoundException if event not found
   */
  async countFindAllQueueUserCanSee(
    search: string,
    userId: number,
    eventId: string,
    page: number,
    size: number,
  ): Promise<number> {
    let queues: Queue[] = [];
    let totalCount: number;
    try {
      [queues, totalCount] = await this.queueRepository.queueUserCanSee(
        search,
        userId,
        eventId,
        page,
        size,
      );
    } catch (error) {
      this.log.error(error);

      throw new BadRequestException(
        transformError(
          `Search: ${JSON.stringify(search)}`,
          ERROR_TYPE.IN_VALID,
        ),
      );
    }

    return totalCount;
  }

  /**
   * get next enroll queue
   * @param queueId - id of queue want to get next enroll
   * @returns QueueDto object with queue data
   * @throws NotFoundException if queue not found
   * @throws BadRequestException if queue is closed
   * @throws BadRequestException if queue is not enroll
   * @throws BadRequestException if queue is not in event
   */
  async getNextEnrollQueue(queueCode: string): Promise<EnrollQueueDto> {
    const userInReq = this.request.user as any;
    const queueExist = await this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: {
            status: true,
            tenant: {
              tenantCode: Equal(userInReq.tenantCode),
            },
          },
        },
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          users: {
            id: In([userInReq.id]),
          },
        },
      ],
    });

    if (!queueExist) {
      throw new NotFoundException(
        transformError(`QueueCode: ${queueCode}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    // check have user waiting in queue
    const enrollQueueExist = await this.enrollQueueRepository.find({
      where: {
        queue: [
          {
            id: queueExist.id,
            status: Not(Equal(QueueEnum.IS_CLOSED)),
            event: {
              status: true,
              tenant: {
                tenantCode: Equal(userInReq.tenantCode),
              },
            },
          },
          {
            id: queueExist.id,
            status: Not(Equal(QueueEnum.IS_CLOSED)),
            users: {
              id: In([userInReq.id]),
            },
          },
        ],
        status: EnrollQueueEnum.PENDING,
      },
      order: {
        sequenceNumber: 'ASC',
      },
    });

    if (!enrollQueueExist || enrollQueueExist.length === 0) {
      // no have user in queue, change queue status to waiting
      await this.queueRepository.update(
        { id: queueExist.id },
        { status: QueueEnum.WAITING },
      );
      return new EnrollQueueDto();
    }

    // find out next enroll queue
    const nextEnrollQueue = enrollQueueExist[0];
    // update status of next enroll queue to serving
    await this.enrollQueueRepository.update(
      { id: nextEnrollQueue.id },
      {
        status: EnrollQueueEnum.SERVING,
        startServe: new Date(),
      },
    );
    // update status of queue to serving if not yet
    if (queueExist.status !== QueueEnum.SERVING) {
      await this.queueRepository.update(
        { id: queueExist.id },
        { status: QueueEnum.SERVING },
      );
    }
    return plainToInstance(EnrollQueueDto, nextEnrollQueue, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * get statistic of queue
   * @param queueId - id of queue want to get statistic
   * @returns StatisticQueueDto object with statistic data
   * @throws NotFoundException if queue not found
   */
  async getStatisticQueue(queueCode: string): Promise<StatisticQueueDto> {
    const existQueue = this.queueRepository.findOne({
      where: [
        {
          code: queueCode,
          status: Not(Equal(QueueEnum.IS_CLOSED)),
          event: { status: true },
        },
      ],
    });

    if (!existQueue) {
      throw new NotFoundException(
        transformError(`QueueCode: ${queueCode}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    const enrollQueues = await this.enrollQueueRepository.find({
      where: {
        queue: { code: queueCode },
        status: Equal(EnrollQueueEnum.DONE),
      },
    });

    if (!enrollQueues || enrollQueues.length === 0) {
      return new StatisticQueueDto();
    }
    const timeWait = enrollQueues.reduce((total, enrollQueue) => {
      if (!enrollQueue.startServe) return total;
      const timeW =
        enrollQueue.startServe.getTime() - enrollQueue.enrollTime.getTime();
      return total + timeW;
    }, 0);
    const timeServe = enrollQueues.reduce((total, enrollQueue) => {
      if (!enrollQueue.startServe) return total;

      const timeW =
        enrollQueue.endServe.getTime() - enrollQueue.startServe.getTime();
      return total + timeW;
    }, 0);

    const newStatistic = new StatisticQueueDto();
    newStatistic.timeServeAvg = timeServe / 1000 / enrollQueues.length;
    newStatistic.timeWaitAvg = timeWait / 1000 / enrollQueues.length;

    return newStatistic;
  }
}
