import {
  BadRequestException,
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
import { createCodeQueue, partialMapping } from 'src/common/algorithm';
import { QueueEnum, commonEnum } from 'src/common/enum';
import { Equal, Not } from 'typeorm';

/**
 * QueuesService class for queues service with CRUD operations for queues and other operations
 */
@Injectable()
export class QueuesService {
  constructor(
    private readonly queueRepository: QueuesRepository,
    private readonly eventRepository: EventsRepository,
    private readonly log: LoggerService,
  ) {}

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
  async findAll(search: any) {
    // start create search
    const filterObj = new FilterOperator();
    // transform to filter
    Object.keys(search).forEach((key) => {
      if (search[key] instanceof Array) {
        search[key].forEach((tmp: any) => {
          filterObj.addOperator(key, tmp);
        });
      } else {
        filterObj.addOperator(key, search[key]);
      }
    });

    let queues: Queue[] = [];
    try {
      queues = await this.queueRepository.find({
        relations: ['event'],
        where: filterObj.transformToQuery(),
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

    return queues.map((queue: Queue) =>
      plainToInstance(QueueDto, queue, {
        excludeExtraneousValues: true,
      }),
    );
  }

  /**
   * Find a queue by id
   * @param id - id of queue
   * @returns QueueDto object with queue data
   * @throws NotFoundException if queue not found
   */
  async findOne(id: number) {
    const queue = await this.queueRepository.findOne({
      where: { id },
      relations: ['event'],
    });
    if (!queue)
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
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
  async update(id: number, updateQueueDto: UpdateQueueDto) {
    let data = await this.queueRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    if (updateQueueDto.eventId) {
      const eventExist = await this.eventRepository.findOne({
        where: { id: updateQueueDto.eventId },
      });

      if (!eventExist) {
        this.log.error('Event not found');
        throw new BadRequestException(
          transformError('Sự kiện', ERROR_TYPE.NOT_FOUND),
        );
      }

      data.event = eventExist;
    }

    data = partialMapping(data, updateQueueDto) as Queue;

    return plainToInstance(QueueDto, this.queueRepository.save(data), {
      excludeExtraneousValues: true,
    });
  }

  /**
   *  Remove a queue by id
   * @param id  - id of queue
   * @returns  QueueDto object with removed queue data
   */
  remove(id: number) {
    return this.queueRepository.delete(id);
  }

  /**
   * assign member into queue by queueId and memberIds
   * @param queueId - id of queue want to assign
   * @param memberIds - array of member id want to assign
   * @returns void
   */
  async assignMemberIntoQueue(queueId: number, memberIds: number[]) {
    // check exist queue isClose in database
    const queueExist = await this.queueRepository.findOne({
      where: { id: queueId },
    });

    if (!queueExist || queueExist.status === QueueEnum.IS_CLOSED) {
      this.log.error('Queue not found');
      throw new BadRequestException(
        transformError('Hàng đợi', ERROR_TYPE.NOT_FOUND),
      );
    }

    return this.queueRepository.assignMemberIntoQueue(queueId, memberIds);
  }
}
