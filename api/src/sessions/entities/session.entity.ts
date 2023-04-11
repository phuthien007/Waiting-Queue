import { EnrollQueue } from 'src/enroll-queues/entities/enroll-queue.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Sessions')
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;

  @Column({
    type: 'json',
  })
  browser: string;

  // relations

  @OneToMany(() => EnrollQueue, (enrollQueue) => enrollQueue.session)
  enrollQueues: Promise<EnrollQueue[]>;
}
