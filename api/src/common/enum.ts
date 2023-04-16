import { Equal } from 'typeorm';

export enum commonEnum {
  ACTIVE = 1,
  INACTIVE = 0,
}

export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

export enum QueueEnum {
  PENDING = 'pending',
  SERVING = 'serving',
  WAITING = 'waiting',
}

export enum EnrollQueueEnum {
  PENDING = 'pending',
  SERVING = 'serving',
  WAITING = 'waiting',
}

export enum OperatorQueryEnum {
  eq = 'eq',
  ne = 'ne',
  gt = 'gt',
  gte = 'gte',
  lt = 'lt',
  lte = 'lte',
  in = 'in',
  notIn = 'notIn',
  isNull = 'isNull',
  isNotNull = 'isNotNull',
  like = 'like',
  notLike = 'notLike',
}
