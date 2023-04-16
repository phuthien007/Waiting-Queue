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
import { partialMapping } from 'src/common/algorithm';

@Injectable()
export class QueuesService {
  constructor(
    private readonly queueRepository: QueuesRepository,
    private readonly eventRepository: EventsRepository,
    private readonly log: LoggerService,
  ) {}
  async create(createQueueDto: CreateQueueDto) {
    // check event exist
    if (!createQueueDto.eventId) {
      this.log.error('Event ID is required');
      throw new BadRequestException(
        transformError('Sự kiện', ERROR_TYPE.REQUIRED),
      );
    }

    const eventExist = await this.eventRepository.findOne({
      where: { id: createQueueDto.eventId },
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

    const savedQueue = await this.queueRepository.save(queue);
    return plainToInstance(QueueDto, savedQueue, {
      excludeExtraneousValues: true,
    });
  }

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

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}
