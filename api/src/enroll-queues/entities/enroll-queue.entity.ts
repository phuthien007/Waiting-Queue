import { EnrollQueueEnum } from 'src/common/enum';
import { Queue } from 'src/queues/entities/queue.entity';
import { Session } from 'src/sessions/entities/session.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('EnrollQueues')
export class EnrollQueue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'sequence_number',
    nullable: true,
  })
  sequenceNumber: number;

  @Column({
    name: 'start_serve',
    nullable: true,
  })
  startServe: Date;

  @Column({
    name: 'end_serve',
    nullable: true,
  })
  endServe: Date;

  @Column({
    name: 'enroll_time',
  })
  enrollTime: Date;

  @Column({
    type: 'enum',
    enum: EnrollQueueEnum,
    default: EnrollQueueEnum.PENDING,
  })
  status: string;

  @Column({
    nullable: true,
  })
  note: string;

  // relations

  @ManyToOne(() => Queue, (queue) => queue.enrollQueues)
  queue: Queue;

  @ManyToOne(() => Session, (session) => session.enrollQueues)
  session: Session;
}
