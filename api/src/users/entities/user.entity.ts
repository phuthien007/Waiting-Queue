import { BaseEntity } from 'src/common/base.entity';
import { RoleEnum, commonEnum } from 'src/common/enum';
import { Event } from 'src/events/entities/event.entity';
import { Queue } from 'src/queues/entities/queue.entity';
import { Tenant } from 'src/tenants/entities/tenants.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'contact_email',
  })
  email: string;

  password: string;

  @Column({
    name: 'full_name',
  })
  fullName: string;

  @Column({ type: 'enum', enum: commonEnum, default: commonEnum.ACTIVE })
  status: boolean;

  @Column({
    nullable: true,
  })
  note: string;

  @Column({
    name: 'reset_token_password',
    nullable: true,
  })
  resetTokenPassword: string;

  @Column({
    name: 'reset_date_password',
    nullable: true,
  })
  resetDatePassword: Date;

  @Column({
    type: 'enum',
    enum: RoleEnum,
    default: RoleEnum.OPERATOR,
  })
  role: string;

  @Column({
    name: 'is_working',
    default: false,
  })
  isWorking: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.users)
  @JoinColumn({
    name: 'tenant_id',
  })
  tenant: Tenant;

  @OneToMany(() => Event, (event) => event.user)
  events: Promise<Event[]>;

  @ManyToMany(() => Queue, (queue) => queue.users)
  queues: Promise<Queue[]>;
}
