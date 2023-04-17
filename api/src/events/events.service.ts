import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { EventsRepository } from './events.repository';
import { LoggerService } from 'src/logger/logger.service';
import { plainToInstance } from 'class-transformer';
import { EventDto } from './dto/event.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { FilterOperator } from 'src/common/filters.vm';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { partialMapping } from 'src/common/algorithm';

/**
 * Events service class for events endpoints (create, update, delete, etc.)
 */
@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventsRepository,
    private readonly log: LoggerService,
  ) {}

  /**
   * create event service method
   * @param createEventDto create event DTO object from request body
   * @returns created event DTO object
   */
  async create(createEventDto: CreateEventDto) {
    // TODO: get user from request, tenant from user
    // create event
    const event = plainToInstance(Event, {
      ...createEventDto,
    });

    const savedEvent = await this.eventRepository.save(event);
    return plainToInstance(EventDto, savedEvent, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * find all events service method with search query
   * @param search search query from request query
   * @returns   array of event DTO objects
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

    let events: Event[] = [];
    try {
      events = await this.eventRepository.find({
        relations: ['tenant'],
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

    return events.map((event: Event) =>
      plainToInstance(EventDto, event, {
        excludeExtraneousValues: true,
      }),
    );
  }

  /**
   * find one event service method with id param
   * @param id event id from request param (id)
   * @returns event DTO object with id
   */
  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!event)
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    return plainToInstance(EventDto, event, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * update event service method with id param and updateEventDto object from request body
   * @param id event id from request param (id)
   * @param updateEventDto update event DTO object from request body
   * @returns updated event DTO object with id
   */
  async update(id: number, updateEventDto: UpdateEventDto) {
    let data = await this.eventRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    data = partialMapping(data, updateEventDto) as Event;

    return plainToInstance(EventDto, this.eventRepository.save(data), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * remove event service method with id param
   * @param id  event id from request param (id)
   * @returns deleted event DTO object with id
   */
  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}
