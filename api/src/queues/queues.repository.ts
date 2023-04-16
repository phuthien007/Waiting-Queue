import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Queue } from './entities/queue.entity';

@Injectable()
export class QueuesRepository extends Repository<Queue> {
  constructor(private readonly dataSource: DataSource) {
    super(Queue, dataSource.createEntityManager());
  }
}
