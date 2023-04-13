import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @CreateDateColumn()
  @Column({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn()
  @Column({
    name: 'updated_at',
  })
  updatedAt: Date;

  @DeleteDateColumn()
  @Column({
    name: 'deleted_at',
  })
  deletedAt: Date;
}
