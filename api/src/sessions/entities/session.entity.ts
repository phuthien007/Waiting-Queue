import { BaseEntity } from 'src/common/base.entity';
import { EnrollQueue } from 'src/enroll-queues/entities/enroll-queue.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({})
  browser: string;
  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;

  // init create date
  @BeforeInsert()
  initCreate() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  // update date
  @BeforeUpdate()
  updateDate() {
    this.updatedAt = new Date();
  }
  // relations

  @OneToMany(() => EnrollQueue, (enrollQueue) => enrollQueue.session)
  enrollQueues: Promise<EnrollQueue[]>;
}
