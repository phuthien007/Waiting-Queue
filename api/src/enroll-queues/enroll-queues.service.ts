import { Injectable } from '@nestjs/common';
import { CreateEnrollQueueDto } from './dto/create-enroll-queue.dto';
import { UpdateEnrollQueueDto } from './dto/update-enroll-queue.dto';
import { EnrollQueuesRepository } from './enroll-queues.repository';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class EnrollQueuesService {
  constructor(
    private readonly enrollQueueRepository: EnrollQueuesRepository,
    // private readonly enrollQueue: EventsRepository,
    private readonly log: LoggerService,
  ) {}
  create(createEnrollQueueDto: CreateEnrollQueueDto) {
    return 'This action adds a new enrollQueue';
  }

  findAll() {
    return `This action returns all enrollQueues`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollQueue`;
  }

  update(id: number, updateEnrollQueueDto: UpdateEnrollQueueDto) {
    return `This action updates a #${id} enrollQueue`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollQueue`;
  }
}
