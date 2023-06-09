import {
  BadRequestException,
  CacheInterceptor,
  Inject,
  Injectable,
  NotFoundException,
  UseInterceptors,
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
import { OperatorQueryEnum } from 'src/common/enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UsersRepository } from 'src/users/users.repository';
import { TenantsRepository } from 'src/tenants/tenants.repository';
import { QueuesRepository } from 'src/queues/queues.repository';
import { PaginateDto } from 'src/common/paginate.dto';
import { Equal } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

/**
 * Events service class for events endpoints (create, update, delete, etc.)
 */
@Injectable()
export class EventsService {
  constructor(
    private readonly eventRepository: EventsRepository,
    private readonly log: LoggerService,
    @Inject(REQUEST) private readonly request: Request,
    private readonly userRepository: UsersRepository,
    private readonly tenantRepository: TenantsRepository,
    private readonly queueRepository: QueuesRepository,
  ) {}

  /**
   * create event service method
   * @param createEventDto create event DTO object from request body
   * @returns created event DTO object
   */
  async create(createEventDto: CreateEventDto) {
    // create event
    // get current user
    const tenantInReq = await this.tenantRepository.findOne({
      where: { tenantCode: (this.request?.user as any)?.tenantCode },
    });

    const event = plainToInstance(Event, {
      ...createEventDto,
    });

    event.tenant = tenantInReq;
    event.user = {
      id: (this.request?.user as any)?.id,
    } as User;

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
  async findAll(search: any): Promise<PaginateDto<EventDto>> {
    // start create search
    const filterObj = new FilterOperator();

    // add tenant code of current user to search event
    const userInReq = this.request?.user as any;
    filterObj.addOperator(
      OperatorQueryEnum.eq,
      `tenant.tenantCode:${userInReq.tenantCode as string}`,
    );

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

    let events: Event[] = [];
    let totalCount: number;

    try {
      [events, totalCount] = await this.eventRepository.findAndCount({
        relations: ['tenant'],
        where: filterObj.transformToQuery(),
        order: filterObj.parseSortToOrder(),
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

    const result = events.map((event: Event) =>
      plainToInstance(EventDto, event, {
        excludeExtraneousValues: true,
      }),
    );

    return new PaginateDto<EventDto>(
      result,
      search.page,
      result.length === search.size ? search.size : result.length,
      totalCount,
    );
  }

  async findAllEventUserCanSee(
    search: string,
    userId: number,
    page: number,
    size: number,
  ): Promise<PaginateDto<EventDto>> {
    // start create search

    const userInReq = this.request?.user as any;

    let events: Event[] = [];
    let totalCount: number;
    try {
      [events, totalCount] = await this.eventRepository.queryEventUserCanSee(
        search,
        userId,
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

    const result = events.map((event: Event) =>
      plainToInstance(EventDto, event, {
        excludeExtraneousValues: true,
      }),
    );
    return new PaginateDto<EventDto>(
      result,
      page,
      result.length === size ? size : result.length,
      totalCount,
    );
  }

  /**
   * find one event service method with id param
   * @param id event id from request param (id)
   * @returns event DTO object with id
   */
  async findOne(id: string) {
    const userInReq = this.request?.user as any;

    const event = await this.eventRepository.findOne({
      where: { id, status: true, tenant: { tenantCode: userInReq.tenantCode } },
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
  async update(id: string, updateEventDto: UpdateEventDto) {
    let data = await this.eventRepository.findOne({
      where: {
        id,
        tenant: { tenantCode: (this.request?.user as any)?.tenantCode },
      },
    });
    if (!data) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    updateEventDto.createdAt = data.createdAt;
    updateEventDto.updatedAt = new Date();

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
  async remove(id: string) {
    const existEvent = await this.eventRepository.findOne({
      where: {
        id,
        tenant: { tenantCode: Equal((this.request?.user as any)?.tenantCode) },
      },
    });
    if (!existEvent) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }
    return this.eventRepository.delete(id);
  }
}
