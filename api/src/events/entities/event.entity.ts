import { BaseEntity } from 'src/common/base.entity';
import { commonEnum } from 'src/common/enum';
import { Queue } from 'src/queues/entities/queue.entity';
import { Tenant } from 'src/tenants/entities/tenant.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Events')
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  name: string;

  @Column({
    nullable: true,
  })
  from: Date;

  @Column({
    nullable: true,
  })
  to: Date;

  @Column({
    nullable: true,
  })
  note: string;

  place: string;

  @Column({
    nullable: true,
    name: 'draw_image_path',
  })
  drawImagePath: string;

  @Column({
    default: 0,
    comment: 'If event dont have expiration date, check daily is 1, or 0 ',
  })
  daily: boolean;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    type: 'enum',
    enum: commonEnum,
    default: commonEnum.ACTIVE,
  })
  status: boolean;

  @ManyToOne(() => Tenant)
  @JoinColumn({
    name: 'tenant_id',
  })
  tenant: Tenant;

  @ManyToOne(() => User, (user) => user.events)
  @JoinColumn({
    name: 'user_id',
  })
  user: User;

  @OneToMany(() => Queue, (queue) => queue.event)
  queues: Promise<Queue[]>;
}
