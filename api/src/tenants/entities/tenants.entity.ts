import { IsNotEmpty } from 'class-validator';
import { type } from 'os';
import { BaseEntity } from 'src/common/base.entity';
import { RoleEnum, commonEnum } from 'src/common/enum';
import { User } from 'src/users/entities/user.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Table,
} from 'typeorm';

/**
 * Tenant class for tenant entity object
 */
@Entity('Tenants')
export class Tenant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    name: 'tenant_code',
    unique: true,
  })
  tenantCode: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  address: string;

  @Column({
    nullable: true,
  })
  website: string;

  @Column({
    name: 'contact_phone',
    nullable: true,
  })
  contactPhone: string;

  @Column({
    name: 'contact_email',
    unique: true,
  })
  contactEmail: string;

  @Column({ type: 'enum', enum: commonEnum, default: commonEnum.ACTIVE })
  status: boolean;

  @Column({
    nullable: true,
  })
  note: string;

  @OneToMany(() => User, (user) => user.tenant)
  users: Promise<User[]>;
}
