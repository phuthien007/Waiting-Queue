import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Event } from './entities/event.entity';

@Injectable()
export class EventsRepository extends Repository<Event> {
  constructor(private readonly dataSource: DataSource) {
    super(Event, dataSource.createEntityManager());
  }
}
