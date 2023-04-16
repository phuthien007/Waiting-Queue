import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
export const HasRole = (...params: any) => SetMetadata(ROLES_KEY, params);
