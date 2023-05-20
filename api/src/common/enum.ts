/**
 * @description: common enum for all project
 */
export enum commonEnum {
  ACTIVE = 1,
  INACTIVE = 0,
}

/**
 * @description: enum for role
 */
export enum RoleEnum {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
}

/**
 * @description: enum for status of queue
 * @enum PENDING: queue is pending
 * @enum SERVING: queue is serving
 * @enum WAITING: queue is waiting when OPERATOR is working but not have patient to serve
 */
export enum QueueEnum {
  PENDING = 'pending',
  SERVING = 'serving',
  WAITING = 'waiting',
  IS_CLOSED = 'is_closed',
}

/**
 * @description: enum for status of enroll queue (when patient enroll queue)
 */
export enum EnrollQueueEnum {
  PENDING = 'pending',
  SERVING = 'serving',
  DONE = 'done',
  BLOCKED = 'is_blocked',
}

/**
 * @description: operator query enum for filter query string
 */
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
