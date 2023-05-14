/* eslint-disable */
/**
 * 
 */
export type FilesControllerFindOneParams = {
fileName: string;
};

export type FilesControllerRemoveParams = {
fileName: string;
};

export type FilesControllerUploadFileBody = {
  file?: Blob;
};

export type EnrollQueuesControllerUpdateStatusEnrollQueueStatus = typeof EnrollQueuesControllerUpdateStatusEnrollQueueStatus[keyof typeof EnrollQueuesControllerUpdateStatusEnrollQueueStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EnrollQueuesControllerUpdateStatusEnrollQueueStatus = {
  pending: 'pending',
  serving: 'serving',
  done: 'done',
  is_blocked: 'is_blocked',
} as const;

export type EnrollQueuesControllerUpdateStatusEnrollQueueParams = {
status: EnrollQueuesControllerUpdateStatusEnrollQueueStatus;
};

export type EnrollQueuesControllerFindAllEnrollQueueStatus = typeof EnrollQueuesControllerFindAllEnrollQueueStatus[keyof typeof EnrollQueuesControllerFindAllEnrollQueueStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const EnrollQueuesControllerFindAllEnrollQueueStatus = {
  pending: 'pending',
  serving: 'serving',
  done: 'done',
  is_blocked: 'is_blocked',
} as const;

export type EnrollQueuesControllerFindAllEnrollQueueParams = {
page: number;
size: number;
queueId: number;
status?: EnrollQueuesControllerFindAllEnrollQueueStatus;
sort?: string;
};

export type EnrollQueuesControllerCreateEnrollQueueParams = {
h: string;
};

export type QueuesControllerFindAllQueueUserCanSeeParams = {
search?: string;
eventId?: number;
page: number;
size: number;
};

export type QueuesControllerFindAllQueueParams = {
eq?: string[];
ne?: string[];
gt?: string[];
gte?: string[];
lt?: string[];
lte?: string[];
in?: string[];
notIn?: string[];
like?: string[];
notLike?: string[];
page?: number;
size?: number;
sort?: string;
};

export type EventsControllerFindAllEventUserCanSeeParams = {
/**
 * Search query name with operator LIKE
 */
search?: string;
page: number;
size: number;
};

export type EventsControllerFindAllEventParams = {
eq?: string[];
ne?: string[];
gt?: string[];
gte?: string[];
lt?: string[];
lte?: string[];
in?: string[];
notIn?: string[];
like?: string[];
notLike?: string[];
page?: number;
size?: number;
sort?: string;
};

export type AuthControllerFinishResetPasswordBody = {
  password?: string;
  confirmPassword?: string;
};

export type UsersControllerFindAllUserParams = {
eq?: string[];
ne?: string[];
gt?: string[];
gte?: string[];
lt?: string[];
lte?: string[];
in?: string[];
notIn?: string[];
like?: string[];
notLike?: string[];
page?: number;
size?: number;
sort?: string;
};

export type TenantsControllerFindAllTenantParams = {
eq?: string[];
ne?: string[];
gt?: string[];
gte?: string[];
lt?: string[];
lte?: string[];
in?: string[];
notIn?: string[];
like?: string[];
notLike?: string[];
page?: number;
size?: number;
sort?: string;
};

export interface CreateEnrollQueueDto {
  note?: string;
  queueCode: string;
}

export interface StatisticQueueDto { [key: string]: any }

export interface Session { [key: string]: any }

export type UpdateQueueDtoStatus = typeof UpdateQueueDtoStatus[keyof typeof UpdateQueueDtoStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateQueueDtoStatus = {
  pending: 'pending',
  serving: 'serving',
  waiting: 'waiting',
  is_closed: 'is_closed',
} as const;

export interface UpdateQueueDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  note?: string;
  coord?: string;
  code?: string;
  description?: string;
  status?: UpdateQueueDtoStatus;
  eventId?: number;
}

export interface QueueDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  note?: string;
  coord?: string;
  code?: string;
  description?: string;
  status?: string;
  event?: EventDto;
}

export interface EnrollQueueDto {
  id?: string;
  waitTimeAvg?: number;
  serveTimeAvg?: number;
  sequenceNumber?: number;
  startServe?: string;
  endServe?: string;
  enrollTime?: string;
  status?: string;
  note?: string;
  queue?: QueueDto;
  session?: Session;
}

export type CreateQueueDtoStatus = typeof CreateQueueDtoStatus[keyof typeof CreateQueueDtoStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateQueueDtoStatus = {
  pending: 'pending',
  serving: 'serving',
  waiting: 'waiting',
  is_closed: 'is_closed',
} as const;

export interface CreateQueueDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  note?: string;
  coord?: string;
  code?: string;
  description?: string;
  status?: CreateQueueDtoStatus;
  eventId?: number;
}

export interface UpdateEventDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  from?: string;
  to?: string;
  note?: string;
  place?: string;
  drawImagePath?: string;
  daily?: boolean;
  description?: string;
  status?: boolean;
  tenantId?: number;
  userId?: number;
}

export interface EventDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  from?: string;
  to?: string;
  note?: string;
  place?: string;
  drawImagePath?: string;
  daily?: boolean;
  description?: string;
  status?: boolean;
  tenant?: TenantDto;
  user?: UserDto;
}

export interface CreateEventDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  from?: string;
  to?: string;
  note?: string;
  place?: string;
  drawImagePath?: string;
  daily?: boolean;
  description?: string;
  status?: boolean;
  tenantId?: number;
  userId?: number;
}

export interface ChangePasswordDto {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordDto {
  email?: string;
  tenantCode?: string;
  /** Type a new password */
  newPassword?: string;
  /** Type password again */
  replyPassword?: string;
}

export interface LoginDto {
  tenantCode: string;
  email: string;
  password: string;
}

export type UserMeDtoRole = typeof UserMeDtoRole[keyof typeof UserMeDtoRole];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UserMeDtoRole = {
  super_admin: 'super_admin',
  admin: 'admin',
  operator: 'operator',
} as const;

export type UserMeDtoStatus = typeof UserMeDtoStatus[keyof typeof UserMeDtoStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UserMeDtoStatus = {
  super_admin: 'super_admin',
  admin: 'admin',
  operator: 'operator',
} as const;

export interface UserMeDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  fullName?: string;
  status?: UserMeDtoStatus;
  note?: string;
  role?: UserMeDtoRole;
  isWorking?: boolean;
  tenant?: TenantDto;
}

export type UpdateUserDtoRole = typeof UpdateUserDtoRole[keyof typeof UpdateUserDtoRole];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateUserDtoRole = {
  super_admin: 'super_admin',
  admin: 'admin',
  operator: 'operator',
} as const;

export type UpdateUserDtoStatus = typeof UpdateUserDtoStatus[keyof typeof UpdateUserDtoStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UpdateUserDtoStatus = {
  NUMBER_1: 1,
  NUMBER_0: 0,
} as const;

export interface UpdateUserDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  password?: string;
  fullName?: string;
  status?: UpdateUserDtoStatus;
  note?: string;
  role?: UpdateUserDtoRole;
  isWorking?: boolean;
  tenantCode?: string;
  resetTokenPassword?: string;
  resetDatePassword?: string;
  queueIds?: string[];
}

export type UserDtoRole = typeof UserDtoRole[keyof typeof UserDtoRole];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UserDtoRole = {
  super_admin: 'super_admin',
  admin: 'admin',
  operator: 'operator',
} as const;

export type UserDtoStatus = typeof UserDtoStatus[keyof typeof UserDtoStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const UserDtoStatus = {
  super_admin: 'super_admin',
  admin: 'admin',
  operator: 'operator',
} as const;

export interface UserDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  fullName?: string;
  status?: UserDtoStatus;
  note?: string;
  role?: UserDtoRole;
  isWorking?: boolean;
  tenant?: TenantDto;
}

export type CreateUserDtoRole = typeof CreateUserDtoRole[keyof typeof CreateUserDtoRole];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateUserDtoRole = {
  super_admin: 'super_admin',
  admin: 'admin',
  operator: 'operator',
} as const;

export type CreateUserDtoStatus = typeof CreateUserDtoStatus[keyof typeof CreateUserDtoStatus];


// eslint-disable-next-line @typescript-eslint/no-redeclare
export const CreateUserDtoStatus = {
  NUMBER_1: 1,
  NUMBER_0: 0,
} as const;

export interface CreateUserDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  email?: string;
  password?: string;
  fullName?: string;
  status?: CreateUserDtoStatus;
  note?: string;
  role?: CreateUserDtoRole;
  isWorking?: boolean;
  tenantCode?: string;
}

export interface UpdateTenantDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  tenantCode?: string;
  description?: string;
  address?: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  status?: boolean;
  note?: string;
}

export interface TenantDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  tenantCode?: string;
  description?: string;
  address?: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  status?: boolean;
  note?: string;
}

export interface CreateTenantDto {
  id?: number;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  tenantCode?: string;
  description?: string;
  address?: string;
  website?: string;
  contactPhone?: string;
  contactEmail?: string;
  status?: boolean;
  note?: string;
}

