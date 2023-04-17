import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'role';
/**
 * custom decorator to set role for route
 * @param params role array (RoleEnum[])
 * @returns decorator function (SetMetadata)
 */
export const HasRole = (...params: any) => SetMetadata(ROLES_KEY, params);
