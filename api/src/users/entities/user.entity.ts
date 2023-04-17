import { BaseEntity } from 'src/common/base.entity';
import { RoleEnum, commonEnum } from 'src/common/enum';
import { Event } from 'src/events/entities/event.entity';
import { Queue } from 'src/queues/entities/queue.entity';
import { Tenant } from 'src/tenants/entities/tenants.entity';
import * as bcrypt from 'bcrypt';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

/**
 * User class for user entity object
 */
@Entity('Users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'contact_email',
  })
  email: string;

  @Column({})
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
    name: 'tenant_code',
    referencedColumnName: 'tenantCode',
  })
  tenant: Tenant;

  @OneToMany(() => Event, (event) => event.user)
  events: Promise<Event[]>;

  @ManyToMany(() => Queue, (queue) => queue.users)
  queues: Promise<Queue[]>;

  // hash password
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  // method mapping password
  async comparePassword(attempt: string): Promise<boolean> {
    return await bcrypt.compare(attempt, this.password);
  }

  // method to check if user is admin
  isAdmin(): boolean {
    return this.role === RoleEnum.ADMIN;
  }

  // method to check if user is operator
  isOperator(): boolean {
    return this.role === RoleEnum.OPERATOR;
  }

  isSuperAdmin(): boolean {
    return this.role === RoleEnum.SUPER_ADMIN;
  }
}
