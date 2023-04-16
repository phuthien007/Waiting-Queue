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

@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventsRepository,
    private readonly log: LoggerService,
  ) {}

  async create(createEventDto: CreateEventDto) {
    // TODO: get user from token, tenant from user
    // create event
    const event = plainToInstance(Event, {
      ...createEventDto,
    });

    const savedEvent = await this.eventRepository.save(event);
    return plainToInstance(EventDto, savedEvent, {
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

  remove(id: number) {
    return this.eventRepository.delete(id);
  }
}
