import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
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
}
