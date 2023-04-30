/* eslint-disable */
/**
 * 
 */
import {
  useQuery,
  useMutation
} from '@tanstack/react-query'
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey
} from '@tanstack/react-query'
import type {
  TenantDto,
  CreateTenantDto,
  TenantsControllerFindAllTenantParams,
  UpdateTenantDto,
  UserDto,
  CreateUserDto,
  UsersControllerFindAllUserParams,
  UpdateUserDto,
  UserMeDto,
  CreateSessionDto,
  UpdateSessionDto,
  LoginDto,
  ResetPasswordDto,
  ChangePasswordDto,
  EventDto,
  CreateEventDto,
  EventsControllerFindAllEventParams,
  EventsControllerFindAllEventUseCanSeeParams,
  UpdateEventDto,
  QueueDto,
  CreateQueueDto,
  QueuesControllerFindAllQueueParams,
  UpdateQueueDto,
  EnrollQueueDto,
  CreateEnrollQueueDto,
  EnrollQueuesControllerFindAllEnrollQueueParams,
  UpdateEnrollQueueDto
} from './waitingQueue.schemas'
import { useCustomInstance } from './use-custom-instance';
import { customFormData } from './custom-form-data';

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


export const useAppControllerGetHelloHook = () => {
        const appControllerGetHello = useCustomInstance<void>();

        return (
    
 signal?: AbortSignal
) => {
        return appControllerGetHello(
          {url: `/api`, method: 'get', signal
    },
          );
        }
      }
    

export const getAppControllerGetHelloQueryKey = () => [`/api`] as const;
  

    
export const useAppControllerGetHelloQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>, TError = unknown>( options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAppControllerGetHelloQueryKey();

  const appControllerGetHello =  useAppControllerGetHelloHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>> = ({ signal }) => appControllerGetHello(signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type AppControllerGetHelloQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>>
export type AppControllerGetHelloQueryError = unknown

export const useAppControllerGetHello = <TData = Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>, TError = unknown>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useAppControllerGetHelloHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useAppControllerGetHelloQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useTenantsControllerCreateTenantHook = () => {
        const tenantsControllerCreateTenant = useCustomInstance<TenantDto>();

        return (
    createTenantDto: CreateTenantDto,
 ) => {
        return tenantsControllerCreateTenant(
          {url: `/api/tenants`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createTenantDto
    },
          );
        }
      }
    


export const useTenantsControllerCreateTenantMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerCreateTenantHook>>>, TError,{data: CreateTenantDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerCreateTenantHook>>>, TError,{data: CreateTenantDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const tenantsControllerCreateTenant =  useTenantsControllerCreateTenantHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerCreateTenantHook>>>, {data: CreateTenantDto}> = (props) => {
          const {data} = props ?? {};

          return  tenantsControllerCreateTenant(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type TenantsControllerCreateTenantMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerCreateTenantHook>>>>
    export type TenantsControllerCreateTenantMutationBody = CreateTenantDto
    export type TenantsControllerCreateTenantMutationError = void

    export const useTenantsControllerCreateTenant = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerCreateTenantHook>>>, TError,{data: CreateTenantDto}, TContext>, }
) => {
    
      const mutationOptions = useTenantsControllerCreateTenantMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useTenantsControllerFindAllTenantHook = () => {
        const tenantsControllerFindAllTenant = useCustomInstance<TenantDto[]>();

        return (
    params?: TenantsControllerFindAllTenantParams,
 signal?: AbortSignal
) => {
        return tenantsControllerFindAllTenant(
          {url: `/api/tenants`, method: 'get',
        params, signal
    },
          );
        }
      }
    

export const getTenantsControllerFindAllTenantQueryKey = (params?: TenantsControllerFindAllTenantParams,) => [`/api/tenants`, ...(params ? [params]: [])] as const;
  

    
export const useTenantsControllerFindAllTenantQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>, TError = void>(params?: TenantsControllerFindAllTenantParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getTenantsControllerFindAllTenantQueryKey(params);

  const tenantsControllerFindAllTenant =  useTenantsControllerFindAllTenantHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>> = ({ signal }) => tenantsControllerFindAllTenant(params, signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type TenantsControllerFindAllTenantQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>>
export type TenantsControllerFindAllTenantQueryError = void

export const useTenantsControllerFindAllTenant = <TData = Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>, TError = void>(
 params?: TenantsControllerFindAllTenantParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindAllTenantHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useTenantsControllerFindAllTenantQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useTenantsControllerRegisterTenantHook = () => {
        const tenantsControllerRegisterTenant = useCustomInstance<TenantDto>();

        return (
    createTenantDto: CreateTenantDto,
 ) => {
        return tenantsControllerRegisterTenant(
          {url: `/api/tenants/register/tenant`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createTenantDto
    },
          );
        }
      }
    


export const useTenantsControllerRegisterTenantMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRegisterTenantHook>>>, TError,{data: CreateTenantDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRegisterTenantHook>>>, TError,{data: CreateTenantDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const tenantsControllerRegisterTenant =  useTenantsControllerRegisterTenantHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRegisterTenantHook>>>, {data: CreateTenantDto}> = (props) => {
          const {data} = props ?? {};

          return  tenantsControllerRegisterTenant(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type TenantsControllerRegisterTenantMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRegisterTenantHook>>>>
    export type TenantsControllerRegisterTenantMutationBody = CreateTenantDto
    export type TenantsControllerRegisterTenantMutationError = void

    export const useTenantsControllerRegisterTenant = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRegisterTenantHook>>>, TError,{data: CreateTenantDto}, TContext>, }
) => {
    
      const mutationOptions = useTenantsControllerRegisterTenantMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useTenantsControllerFindOneTenantHook = () => {
        const tenantsControllerFindOneTenant = useCustomInstance<TenantDto>();

        return (
    id: number,
 signal?: AbortSignal
) => {
        return tenantsControllerFindOneTenant(
          {url: `/api/tenants/${id}`, method: 'get', signal
    },
          );
        }
      }
    

export const getTenantsControllerFindOneTenantQueryKey = (id: number,) => [`/api/tenants/${id}`] as const;
  

    
export const useTenantsControllerFindOneTenantQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>, TError = void>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getTenantsControllerFindOneTenantQueryKey(id);

  const tenantsControllerFindOneTenant =  useTenantsControllerFindOneTenantHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>> = ({ signal }) => tenantsControllerFindOneTenant(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type TenantsControllerFindOneTenantQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>>
export type TenantsControllerFindOneTenantQueryError = void

export const useTenantsControllerFindOneTenant = <TData = Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>, TError = void>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerFindOneTenantHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useTenantsControllerFindOneTenantQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useTenantsControllerUpdateTenantHook = () => {
        const tenantsControllerUpdateTenant = useCustomInstance<TenantDto>();

        return (
    id: number,
    updateTenantDto: UpdateTenantDto,
 ) => {
        return tenantsControllerUpdateTenant(
          {url: `/api/tenants/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateTenantDto
    },
          );
        }
      }
    


export const useTenantsControllerUpdateTenantMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateTenantHook>>>, TError,{id: number;data: UpdateTenantDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateTenantHook>>>, TError,{id: number;data: UpdateTenantDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const tenantsControllerUpdateTenant =  useTenantsControllerUpdateTenantHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateTenantHook>>>, {id: number;data: UpdateTenantDto}> = (props) => {
          const {id,data} = props ?? {};

          return  tenantsControllerUpdateTenant(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type TenantsControllerUpdateTenantMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateTenantHook>>>>
    export type TenantsControllerUpdateTenantMutationBody = UpdateTenantDto
    export type TenantsControllerUpdateTenantMutationError = void

    export const useTenantsControllerUpdateTenant = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateTenantHook>>>, TError,{id: number;data: UpdateTenantDto}, TContext>, }
) => {
    
      const mutationOptions = useTenantsControllerUpdateTenantMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useTenantsControllerRemoveTenantHook = () => {
        const tenantsControllerRemoveTenant = useCustomInstance<void>();

        return (
    id: number,
 ) => {
        return tenantsControllerRemoveTenant(
          {url: `/api/tenants/${id}`, method: 'delete'
    },
          );
        }
      }
    


export const useTenantsControllerRemoveTenantMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRemoveTenantHook>>>, TError,{id: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRemoveTenantHook>>>, TError,{id: number}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const tenantsControllerRemoveTenant =  useTenantsControllerRemoveTenantHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRemoveTenantHook>>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  tenantsControllerRemoveTenant(id,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type TenantsControllerRemoveTenantMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRemoveTenantHook>>>>
    
    export type TenantsControllerRemoveTenantMutationError = unknown

    export const useTenantsControllerRemoveTenant = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerRemoveTenantHook>>>, TError,{id: number}, TContext>, }
) => {
    
      const mutationOptions = useTenantsControllerRemoveTenantMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useTenantsControllerUpdateMyTenantHook = () => {
        const tenantsControllerUpdateMyTenant = useCustomInstance<void>();

        return (
    updateTenantDto: UpdateTenantDto,
 ) => {
        return tenantsControllerUpdateMyTenant(
          {url: `/api/tenants/profile/myTenant`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateTenantDto
    },
          );
        }
      }
    


export const useTenantsControllerUpdateMyTenantMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateMyTenantHook>>>, TError,{data: UpdateTenantDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateMyTenantHook>>>, TError,{data: UpdateTenantDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const tenantsControllerUpdateMyTenant =  useTenantsControllerUpdateMyTenantHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateMyTenantHook>>>, {data: UpdateTenantDto}> = (props) => {
          const {data} = props ?? {};

          return  tenantsControllerUpdateMyTenant(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type TenantsControllerUpdateMyTenantMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateMyTenantHook>>>>
    export type TenantsControllerUpdateMyTenantMutationBody = UpdateTenantDto
    export type TenantsControllerUpdateMyTenantMutationError = unknown

    export const useTenantsControllerUpdateMyTenant = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useTenantsControllerUpdateMyTenantHook>>>, TError,{data: UpdateTenantDto}, TContext>, }
) => {
    
      const mutationOptions = useTenantsControllerUpdateMyTenantMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useUsersControllerCreateUserHook = () => {
        const usersControllerCreateUser = useCustomInstance<UserDto>();

        return (
    createUserDto: CreateUserDto,
 ) => {
        return usersControllerCreateUser(
          {url: `/api/users`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createUserDto
    },
          );
        }
      }
    


export const useUsersControllerCreateUserMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerCreateUserHook>>>, TError,{data: CreateUserDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerCreateUserHook>>>, TError,{data: CreateUserDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const usersControllerCreateUser =  useUsersControllerCreateUserHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerCreateUserHook>>>, {data: CreateUserDto}> = (props) => {
          const {data} = props ?? {};

          return  usersControllerCreateUser(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type UsersControllerCreateUserMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerCreateUserHook>>>>
    export type UsersControllerCreateUserMutationBody = CreateUserDto
    export type UsersControllerCreateUserMutationError = void

    export const useUsersControllerCreateUser = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerCreateUserHook>>>, TError,{data: CreateUserDto}, TContext>, }
) => {
    
      const mutationOptions = useUsersControllerCreateUserMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useUsersControllerFindAllUserHook = () => {
        const usersControllerFindAllUser = useCustomInstance<UserDto[]>();

        return (
    params?: UsersControllerFindAllUserParams,
 signal?: AbortSignal
) => {
        return usersControllerFindAllUser(
          {url: `/api/users`, method: 'get',
        params, signal
    },
          );
        }
      }
    

export const getUsersControllerFindAllUserQueryKey = (params?: UsersControllerFindAllUserParams,) => [`/api/users`, ...(params ? [params]: [])] as const;
  

    
export const useUsersControllerFindAllUserQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>, TError = void>(params?: UsersControllerFindAllUserParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerFindAllUserQueryKey(params);

  const usersControllerFindAllUser =  useUsersControllerFindAllUserHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>> = ({ signal }) => usersControllerFindAllUser(params, signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type UsersControllerFindAllUserQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>>
export type UsersControllerFindAllUserQueryError = void

export const useUsersControllerFindAllUser = <TData = Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>, TError = void>(
 params?: UsersControllerFindAllUserParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindAllUserHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useUsersControllerFindAllUserQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useUsersControllerFindOneUserHook = () => {
        const usersControllerFindOneUser = useCustomInstance<UserDto>();

        return (
    id: number,
 signal?: AbortSignal
) => {
        return usersControllerFindOneUser(
          {url: `/api/users/${id}`, method: 'get', signal
    },
          );
        }
      }
    

export const getUsersControllerFindOneUserQueryKey = (id: number,) => [`/api/users/${id}`] as const;
  

    
export const useUsersControllerFindOneUserQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>, TError = void>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerFindOneUserQueryKey(id);

  const usersControllerFindOneUser =  useUsersControllerFindOneUserHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>> = ({ signal }) => usersControllerFindOneUser(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type UsersControllerFindOneUserQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>>
export type UsersControllerFindOneUserQueryError = void

export const useUsersControllerFindOneUser = <TData = Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>, TError = void>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerFindOneUserHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useUsersControllerFindOneUserQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useUsersControllerUpdateUserHook = () => {
        const usersControllerUpdateUser = useCustomInstance<UserDto>();

        return (
    id: number,
    updateUserDto: UpdateUserDto,
 ) => {
        return usersControllerUpdateUser(
          {url: `/api/users/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateUserDto
    },
          );
        }
      }
    


export const useUsersControllerUpdateUserMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateUserHook>>>, TError,{id: number;data: UpdateUserDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateUserHook>>>, TError,{id: number;data: UpdateUserDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const usersControllerUpdateUser =  useUsersControllerUpdateUserHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateUserHook>>>, {id: number;data: UpdateUserDto}> = (props) => {
          const {id,data} = props ?? {};

          return  usersControllerUpdateUser(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type UsersControllerUpdateUserMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateUserHook>>>>
    export type UsersControllerUpdateUserMutationBody = UpdateUserDto
    export type UsersControllerUpdateUserMutationError = void

    export const useUsersControllerUpdateUser = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateUserHook>>>, TError,{id: number;data: UpdateUserDto}, TContext>, }
) => {
    
      const mutationOptions = useUsersControllerUpdateUserMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useUsersControllerRemoveUserHook = () => {
        const usersControllerRemoveUser = useCustomInstance<void>();

        return (
    id: number,
 ) => {
        return usersControllerRemoveUser(
          {url: `/api/users/${id}`, method: 'delete'
    },
          );
        }
      }
    


export const useUsersControllerRemoveUserMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerRemoveUserHook>>>, TError,{id: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerRemoveUserHook>>>, TError,{id: number}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const usersControllerRemoveUser =  useUsersControllerRemoveUserHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerRemoveUserHook>>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  usersControllerRemoveUser(id,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type UsersControllerRemoveUserMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerRemoveUserHook>>>>
    
    export type UsersControllerRemoveUserMutationError = unknown

    export const useUsersControllerRemoveUser = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerRemoveUserHook>>>, TError,{id: number}, TContext>, }
) => {
    
      const mutationOptions = useUsersControllerRemoveUserMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useUsersControllerGetMeHook = () => {
        const usersControllerGetMe = useCustomInstance<UserDto>();

        return (
    
 signal?: AbortSignal
) => {
        return usersControllerGetMe(
          {url: `/api/users/profile/me`, method: 'get', signal
    },
          );
        }
      }
    

export const getUsersControllerGetMeQueryKey = () => [`/api/users/profile/me`] as const;
  

    
export const useUsersControllerGetMeQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>, TError = void>( options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUsersControllerGetMeQueryKey();

  const usersControllerGetMe =  useUsersControllerGetMeHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>> = ({ signal }) => usersControllerGetMe(signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type UsersControllerGetMeQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>>
export type UsersControllerGetMeQueryError = void

export const useUsersControllerGetMe = <TData = Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>, TError = void>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerGetMeHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useUsersControllerGetMeQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useUsersControllerUpdateMeHook = () => {
        const usersControllerUpdateMe = useCustomInstance<UserMeDto>();

        return (
    updateUserDto: UpdateUserDto,
 ) => {
        return usersControllerUpdateMe(
          {url: `/api/users/profile/me`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateUserDto
    },
          );
        }
      }
    


export const useUsersControllerUpdateMeMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateMeHook>>>, TError,{data: UpdateUserDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateMeHook>>>, TError,{data: UpdateUserDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const usersControllerUpdateMe =  useUsersControllerUpdateMeHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateMeHook>>>, {data: UpdateUserDto}> = (props) => {
          const {data} = props ?? {};

          return  usersControllerUpdateMe(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type UsersControllerUpdateMeMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateMeHook>>>>
    export type UsersControllerUpdateMeMutationBody = UpdateUserDto
    export type UsersControllerUpdateMeMutationError = void

    export const useUsersControllerUpdateMe = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useUsersControllerUpdateMeHook>>>, TError,{data: UpdateUserDto}, TContext>, }
) => {
    
      const mutationOptions = useUsersControllerUpdateMeMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useSessionsControllerCreateSessionHook = () => {
        const sessionsControllerCreateSession = useCustomInstance<void>();

        return (
    createSessionDto: CreateSessionDto,
 ) => {
        return sessionsControllerCreateSession(
          {url: `/api/sessions`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createSessionDto
    },
          );
        }
      }
    


export const useSessionsControllerCreateSessionMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerCreateSessionHook>>>, TError,{data: CreateSessionDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerCreateSessionHook>>>, TError,{data: CreateSessionDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const sessionsControllerCreateSession =  useSessionsControllerCreateSessionHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useSessionsControllerCreateSessionHook>>>, {data: CreateSessionDto}> = (props) => {
          const {data} = props ?? {};

          return  sessionsControllerCreateSession(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type SessionsControllerCreateSessionMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useSessionsControllerCreateSessionHook>>>>
    export type SessionsControllerCreateSessionMutationBody = CreateSessionDto
    export type SessionsControllerCreateSessionMutationError = unknown

    export const useSessionsControllerCreateSession = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerCreateSessionHook>>>, TError,{data: CreateSessionDto}, TContext>, }
) => {
    
      const mutationOptions = useSessionsControllerCreateSessionMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useSessionsControllerFindAllSessionHook = () => {
        const sessionsControllerFindAllSession = useCustomInstance<void>();

        return (
    
 signal?: AbortSignal
) => {
        return sessionsControllerFindAllSession(
          {url: `/api/sessions`, method: 'get', signal
    },
          );
        }
      }
    

export const getSessionsControllerFindAllSessionQueryKey = () => [`/api/sessions`] as const;
  

    
export const useSessionsControllerFindAllSessionQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>, TError = unknown>( options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSessionsControllerFindAllSessionQueryKey();

  const sessionsControllerFindAllSession =  useSessionsControllerFindAllSessionHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>> = ({ signal }) => sessionsControllerFindAllSession(signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type SessionsControllerFindAllSessionQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>>
export type SessionsControllerFindAllSessionQueryError = unknown

export const useSessionsControllerFindAllSession = <TData = Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>, TError = unknown>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindAllSessionHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useSessionsControllerFindAllSessionQueryOptions(options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useSessionsControllerFindOneSessionHook = () => {
        const sessionsControllerFindOneSession = useCustomInstance<void>();

        return (
    id: string,
 signal?: AbortSignal
) => {
        return sessionsControllerFindOneSession(
          {url: `/api/sessions/${id}`, method: 'get', signal
    },
          );
        }
      }
    

export const getSessionsControllerFindOneSessionQueryKey = (id: string,) => [`/api/sessions/${id}`] as const;
  

    
export const useSessionsControllerFindOneSessionQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>, TError = unknown>(id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSessionsControllerFindOneSessionQueryKey(id);

  const sessionsControllerFindOneSession =  useSessionsControllerFindOneSessionHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>> = ({ signal }) => sessionsControllerFindOneSession(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type SessionsControllerFindOneSessionQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>>
export type SessionsControllerFindOneSessionQueryError = unknown

export const useSessionsControllerFindOneSession = <TData = Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>, TError = unknown>(
 id: string, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerFindOneSessionHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useSessionsControllerFindOneSessionQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useSessionsControllerUpdateSessionHook = () => {
        const sessionsControllerUpdateSession = useCustomInstance<void>();

        return (
    id: string,
    updateSessionDto: UpdateSessionDto,
 ) => {
        return sessionsControllerUpdateSession(
          {url: `/api/sessions/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateSessionDto
    },
          );
        }
      }
    


export const useSessionsControllerUpdateSessionMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerUpdateSessionHook>>>, TError,{id: string;data: UpdateSessionDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerUpdateSessionHook>>>, TError,{id: string;data: UpdateSessionDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const sessionsControllerUpdateSession =  useSessionsControllerUpdateSessionHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useSessionsControllerUpdateSessionHook>>>, {id: string;data: UpdateSessionDto}> = (props) => {
          const {id,data} = props ?? {};

          return  sessionsControllerUpdateSession(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type SessionsControllerUpdateSessionMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useSessionsControllerUpdateSessionHook>>>>
    export type SessionsControllerUpdateSessionMutationBody = UpdateSessionDto
    export type SessionsControllerUpdateSessionMutationError = unknown

    export const useSessionsControllerUpdateSession = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerUpdateSessionHook>>>, TError,{id: string;data: UpdateSessionDto}, TContext>, }
) => {
    
      const mutationOptions = useSessionsControllerUpdateSessionMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useSessionsControllerRemoveSessionHook = () => {
        const sessionsControllerRemoveSession = useCustomInstance<void>();

        return (
    id: string,
 ) => {
        return sessionsControllerRemoveSession(
          {url: `/api/sessions/${id}`, method: 'delete'
    },
          );
        }
      }
    


export const useSessionsControllerRemoveSessionMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerRemoveSessionHook>>>, TError,{id: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerRemoveSessionHook>>>, TError,{id: string}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const sessionsControllerRemoveSession =  useSessionsControllerRemoveSessionHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useSessionsControllerRemoveSessionHook>>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  sessionsControllerRemoveSession(id,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type SessionsControllerRemoveSessionMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useSessionsControllerRemoveSessionHook>>>>
    
    export type SessionsControllerRemoveSessionMutationError = unknown

    export const useSessionsControllerRemoveSession = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useSessionsControllerRemoveSessionHook>>>, TError,{id: string}, TContext>, }
) => {
    
      const mutationOptions = useSessionsControllerRemoveSessionMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useAuthControllerLoginHook = () => {
        const authControllerLogin = useCustomInstance<void>();

        return (
    loginDto: LoginDto,
 ) => {
        return authControllerLogin(
          {url: `/api/auth/login`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: loginDto
    },
          );
        }
      }
    


export const useAuthControllerLoginMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerLoginHook>>>, TError,{data: LoginDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerLoginHook>>>, TError,{data: LoginDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const authControllerLogin =  useAuthControllerLoginHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useAuthControllerLoginHook>>>, {data: LoginDto}> = (props) => {
          const {data} = props ?? {};

          return  authControllerLogin(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLoginMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useAuthControllerLoginHook>>>>
    export type AuthControllerLoginMutationBody = LoginDto
    export type AuthControllerLoginMutationError = unknown

    export const useAuthControllerLogin = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerLoginHook>>>, TError,{data: LoginDto}, TContext>, }
) => {
    
      const mutationOptions = useAuthControllerLoginMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useAuthControllerCreateResetPasswordHook = () => {
        const authControllerCreateResetPassword = useCustomInstance<void>();

        return (
    resetPasswordDto: ResetPasswordDto,
 ) => {
        return authControllerCreateResetPassword(
          {url: `/api/auth/reset-password`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: resetPasswordDto
    },
          );
        }
      }
    


export const useAuthControllerCreateResetPasswordMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerCreateResetPasswordHook>>>, TError,{data: ResetPasswordDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerCreateResetPasswordHook>>>, TError,{data: ResetPasswordDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const authControllerCreateResetPassword =  useAuthControllerCreateResetPasswordHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useAuthControllerCreateResetPasswordHook>>>, {data: ResetPasswordDto}> = (props) => {
          const {data} = props ?? {};

          return  authControllerCreateResetPassword(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type AuthControllerCreateResetPasswordMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useAuthControllerCreateResetPasswordHook>>>>
    export type AuthControllerCreateResetPasswordMutationBody = ResetPasswordDto
    export type AuthControllerCreateResetPasswordMutationError = unknown

    export const useAuthControllerCreateResetPassword = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerCreateResetPasswordHook>>>, TError,{data: ResetPasswordDto}, TContext>, }
) => {
    
      const mutationOptions = useAuthControllerCreateResetPasswordMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useAuthControllerFinishResetPasswordHook = () => {
        const authControllerFinishResetPassword = useCustomInstance<void>();

        return (
    token: string,
 ) => {
        return authControllerFinishResetPassword(
          {url: `/api/auth/finish-reset-password/${token}`, method: 'post'
    },
          );
        }
      }
    


export const useAuthControllerFinishResetPasswordMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerFinishResetPasswordHook>>>, TError,{token: string}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerFinishResetPasswordHook>>>, TError,{token: string}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const authControllerFinishResetPassword =  useAuthControllerFinishResetPasswordHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useAuthControllerFinishResetPasswordHook>>>, {token: string}> = (props) => {
          const {token} = props ?? {};

          return  authControllerFinishResetPassword(token,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type AuthControllerFinishResetPasswordMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useAuthControllerFinishResetPasswordHook>>>>
    
    export type AuthControllerFinishResetPasswordMutationError = unknown

    export const useAuthControllerFinishResetPassword = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerFinishResetPasswordHook>>>, TError,{token: string}, TContext>, }
) => {
    
      const mutationOptions = useAuthControllerFinishResetPasswordMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useAuthControllerLogoutHook = () => {
        const authControllerLogout = useCustomInstance<void>();

        return (
    
 ) => {
        return authControllerLogout(
          {url: `/api/auth/logout`, method: 'post'
    },
          );
        }
      }
    


export const useAuthControllerLogoutMutationOptions = <TError = unknown,
    TVariables = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerLogoutHook>>>, TError,TVariables, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerLogoutHook>>>, TError,TVariables, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const authControllerLogout =  useAuthControllerLogoutHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useAuthControllerLogoutHook>>>, TVariables> = () => {
          

          return  authControllerLogout()
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLogoutMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useAuthControllerLogoutHook>>>>
    
    export type AuthControllerLogoutMutationError = unknown

    export const useAuthControllerLogout = <TError = unknown,
    TVariables = void,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerLogoutHook>>>, TError,TVariables, TContext>, }
) => {
    
      const mutationOptions = useAuthControllerLogoutMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useAuthControllerChangePasswordHook = () => {
        const authControllerChangePassword = useCustomInstance<void>();

        return (
    changePasswordDto: ChangePasswordDto,
 ) => {
        return authControllerChangePassword(
          {url: `/api/auth/change-password`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: changePasswordDto
    },
          );
        }
      }
    


export const useAuthControllerChangePasswordMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerChangePasswordHook>>>, TError,{data: ChangePasswordDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerChangePasswordHook>>>, TError,{data: ChangePasswordDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const authControllerChangePassword =  useAuthControllerChangePasswordHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useAuthControllerChangePasswordHook>>>, {data: ChangePasswordDto}> = (props) => {
          const {data} = props ?? {};

          return  authControllerChangePassword(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type AuthControllerChangePasswordMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useAuthControllerChangePasswordHook>>>>
    export type AuthControllerChangePasswordMutationBody = ChangePasswordDto
    export type AuthControllerChangePasswordMutationError = unknown

    export const useAuthControllerChangePassword = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useAuthControllerChangePasswordHook>>>, TError,{data: ChangePasswordDto}, TContext>, }
) => {
    
      const mutationOptions = useAuthControllerChangePasswordMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useEventsControllerCreateEventHook = () => {
        const eventsControllerCreateEvent = useCustomInstance<EventDto>();

        return (
    createEventDto: CreateEventDto,
 ) => {
        return eventsControllerCreateEvent(
          {url: `/api/events`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createEventDto
    },
          );
        }
      }
    


export const useEventsControllerCreateEventMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerCreateEventHook>>>, TError,{data: CreateEventDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerCreateEventHook>>>, TError,{data: CreateEventDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const eventsControllerCreateEvent =  useEventsControllerCreateEventHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEventsControllerCreateEventHook>>>, {data: CreateEventDto}> = (props) => {
          const {data} = props ?? {};

          return  eventsControllerCreateEvent(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type EventsControllerCreateEventMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEventsControllerCreateEventHook>>>>
    export type EventsControllerCreateEventMutationBody = CreateEventDto
    export type EventsControllerCreateEventMutationError = void

    export const useEventsControllerCreateEvent = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerCreateEventHook>>>, TError,{data: CreateEventDto}, TContext>, }
) => {
    
      const mutationOptions = useEventsControllerCreateEventMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useEventsControllerFindAllEventHook = () => {
        const eventsControllerFindAllEvent = useCustomInstance<EventDto[]>();

        return (
    params?: EventsControllerFindAllEventParams,
 signal?: AbortSignal
) => {
        return eventsControllerFindAllEvent(
          {url: `/api/events`, method: 'get',
        params, signal
    },
          );
        }
      }
    

export const getEventsControllerFindAllEventQueryKey = (params?: EventsControllerFindAllEventParams,) => [`/api/events`, ...(params ? [params]: [])] as const;
  

    
export const useEventsControllerFindAllEventQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>, TError = void>(params?: EventsControllerFindAllEventParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getEventsControllerFindAllEventQueryKey(params);

  const eventsControllerFindAllEvent =  useEventsControllerFindAllEventHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>> = ({ signal }) => eventsControllerFindAllEvent(params, signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type EventsControllerFindAllEventQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>>
export type EventsControllerFindAllEventQueryError = void

export const useEventsControllerFindAllEvent = <TData = Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>, TError = void>(
 params?: EventsControllerFindAllEventParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useEventsControllerFindAllEventQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useEventsControllerFindAllEventUseCanSeeHook = () => {
        const eventsControllerFindAllEventUseCanSee = useCustomInstance<EventDto[]>();

        return (
    params?: EventsControllerFindAllEventUseCanSeeParams,
 signal?: AbortSignal
) => {
        return eventsControllerFindAllEventUseCanSee(
          {url: `/api/events/my-events`, method: 'get',
        params, signal
    },
          );
        }
      }
    

export const getEventsControllerFindAllEventUseCanSeeQueryKey = (params?: EventsControllerFindAllEventUseCanSeeParams,) => [`/api/events/my-events`, ...(params ? [params]: [])] as const;
  

    
export const useEventsControllerFindAllEventUseCanSeeQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>, TError = void>(params?: EventsControllerFindAllEventUseCanSeeParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getEventsControllerFindAllEventUseCanSeeQueryKey(params);

  const eventsControllerFindAllEventUseCanSee =  useEventsControllerFindAllEventUseCanSeeHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>> = ({ signal }) => eventsControllerFindAllEventUseCanSee(params, signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type EventsControllerFindAllEventUseCanSeeQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>>
export type EventsControllerFindAllEventUseCanSeeQueryError = void

export const useEventsControllerFindAllEventUseCanSee = <TData = Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>, TError = void>(
 params?: EventsControllerFindAllEventUseCanSeeParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindAllEventUseCanSeeHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useEventsControllerFindAllEventUseCanSeeQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useEventsControllerFindOneEventHook = () => {
        const eventsControllerFindOneEvent = useCustomInstance<EventDto>();

        return (
    id: number,
 signal?: AbortSignal
) => {
        return eventsControllerFindOneEvent(
          {url: `/api/events/${id}`, method: 'get', signal
    },
          );
        }
      }
    

export const getEventsControllerFindOneEventQueryKey = (id: number,) => [`/api/events/${id}`] as const;
  

    
export const useEventsControllerFindOneEventQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>, TError = void>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getEventsControllerFindOneEventQueryKey(id);

  const eventsControllerFindOneEvent =  useEventsControllerFindOneEventHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>> = ({ signal }) => eventsControllerFindOneEvent(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type EventsControllerFindOneEventQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>>
export type EventsControllerFindOneEventQueryError = void

export const useEventsControllerFindOneEvent = <TData = Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>, TError = void>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerFindOneEventHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useEventsControllerFindOneEventQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useEventsControllerUpdateEventHook = () => {
        const eventsControllerUpdateEvent = useCustomInstance<EventDto>();

        return (
    id: number,
    updateEventDto: UpdateEventDto,
 ) => {
        return eventsControllerUpdateEvent(
          {url: `/api/events/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateEventDto
    },
          );
        }
      }
    


export const useEventsControllerUpdateEventMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerUpdateEventHook>>>, TError,{id: number;data: UpdateEventDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerUpdateEventHook>>>, TError,{id: number;data: UpdateEventDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const eventsControllerUpdateEvent =  useEventsControllerUpdateEventHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEventsControllerUpdateEventHook>>>, {id: number;data: UpdateEventDto}> = (props) => {
          const {id,data} = props ?? {};

          return  eventsControllerUpdateEvent(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type EventsControllerUpdateEventMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEventsControllerUpdateEventHook>>>>
    export type EventsControllerUpdateEventMutationBody = UpdateEventDto
    export type EventsControllerUpdateEventMutationError = void

    export const useEventsControllerUpdateEvent = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerUpdateEventHook>>>, TError,{id: number;data: UpdateEventDto}, TContext>, }
) => {
    
      const mutationOptions = useEventsControllerUpdateEventMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useEventsControllerRemoveEventHook = () => {
        const eventsControllerRemoveEvent = useCustomInstance<void>();

        return (
    id: number,
 ) => {
        return eventsControllerRemoveEvent(
          {url: `/api/events/${id}`, method: 'delete'
    },
          );
        }
      }
    


export const useEventsControllerRemoveEventMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerRemoveEventHook>>>, TError,{id: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerRemoveEventHook>>>, TError,{id: number}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const eventsControllerRemoveEvent =  useEventsControllerRemoveEventHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEventsControllerRemoveEventHook>>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  eventsControllerRemoveEvent(id,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type EventsControllerRemoveEventMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEventsControllerRemoveEventHook>>>>
    
    export type EventsControllerRemoveEventMutationError = unknown

    export const useEventsControllerRemoveEvent = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEventsControllerRemoveEventHook>>>, TError,{id: number}, TContext>, }
) => {
    
      const mutationOptions = useEventsControllerRemoveEventMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useQueuesControllerCreateQueueHook = () => {
        const queuesControllerCreateQueue = useCustomInstance<QueueDto>();

        return (
    createQueueDto: CreateQueueDto,
 ) => {
        return queuesControllerCreateQueue(
          {url: `/api/queues`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createQueueDto
    },
          );
        }
      }
    


export const useQueuesControllerCreateQueueMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerCreateQueueHook>>>, TError,{data: CreateQueueDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerCreateQueueHook>>>, TError,{data: CreateQueueDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const queuesControllerCreateQueue =  useQueuesControllerCreateQueueHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerCreateQueueHook>>>, {data: CreateQueueDto}> = (props) => {
          const {data} = props ?? {};

          return  queuesControllerCreateQueue(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type QueuesControllerCreateQueueMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerCreateQueueHook>>>>
    export type QueuesControllerCreateQueueMutationBody = CreateQueueDto
    export type QueuesControllerCreateQueueMutationError = void

    export const useQueuesControllerCreateQueue = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerCreateQueueHook>>>, TError,{data: CreateQueueDto}, TContext>, }
) => {
    
      const mutationOptions = useQueuesControllerCreateQueueMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useQueuesControllerFindAllQueueHook = () => {
        const queuesControllerFindAllQueue = useCustomInstance<QueueDto[]>();

        return (
    params?: QueuesControllerFindAllQueueParams,
 signal?: AbortSignal
) => {
        return queuesControllerFindAllQueue(
          {url: `/api/queues`, method: 'get',
        params, signal
    },
          );
        }
      }
    

export const getQueuesControllerFindAllQueueQueryKey = (params?: QueuesControllerFindAllQueueParams,) => [`/api/queues`, ...(params ? [params]: [])] as const;
  

    
export const useQueuesControllerFindAllQueueQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>, TError = void>(params?: QueuesControllerFindAllQueueParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getQueuesControllerFindAllQueueQueryKey(params);

  const queuesControllerFindAllQueue =  useQueuesControllerFindAllQueueHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>> = ({ signal }) => queuesControllerFindAllQueue(params, signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type QueuesControllerFindAllQueueQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>>
export type QueuesControllerFindAllQueueQueryError = void

export const useQueuesControllerFindAllQueue = <TData = Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>, TError = void>(
 params?: QueuesControllerFindAllQueueParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindAllQueueHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useQueuesControllerFindAllQueueQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useQueuesControllerAssignMemberHook = () => {
        const queuesControllerAssignMember = useCustomInstance<void>();

        return (
    id: number,
    queuesControllerAssignMemberBody: number[],
 ) => {
        return queuesControllerAssignMember(
          {url: `/api/queues/${id}/assign-member`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: queuesControllerAssignMemberBody
    },
          );
        }
      }
    


export const useQueuesControllerAssignMemberMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerAssignMemberHook>>>, TError,{id: number;data: number[]}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerAssignMemberHook>>>, TError,{id: number;data: number[]}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const queuesControllerAssignMember =  useQueuesControllerAssignMemberHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerAssignMemberHook>>>, {id: number;data: number[]}> = (props) => {
          const {id,data} = props ?? {};

          return  queuesControllerAssignMember(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type QueuesControllerAssignMemberMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerAssignMemberHook>>>>
    export type QueuesControllerAssignMemberMutationBody = number[]
    export type QueuesControllerAssignMemberMutationError = unknown

    export const useQueuesControllerAssignMember = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerAssignMemberHook>>>, TError,{id: number;data: number[]}, TContext>, }
) => {
    
      const mutationOptions = useQueuesControllerAssignMemberMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useQueuesControllerFindOneQueueHook = () => {
        const queuesControllerFindOneQueue = useCustomInstance<QueueDto>();

        return (
    id: number,
 signal?: AbortSignal
) => {
        return queuesControllerFindOneQueue(
          {url: `/api/queues/${id}`, method: 'get', signal
    },
          );
        }
      }
    

export const getQueuesControllerFindOneQueueQueryKey = (id: number,) => [`/api/queues/${id}`] as const;
  

    
export const useQueuesControllerFindOneQueueQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>, TError = void>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getQueuesControllerFindOneQueueQueryKey(id);

  const queuesControllerFindOneQueue =  useQueuesControllerFindOneQueueHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>> = ({ signal }) => queuesControllerFindOneQueue(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type QueuesControllerFindOneQueueQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>>
export type QueuesControllerFindOneQueueQueryError = void

export const useQueuesControllerFindOneQueue = <TData = Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>, TError = void>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerFindOneQueueHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useQueuesControllerFindOneQueueQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useQueuesControllerUpdateQueueHook = () => {
        const queuesControllerUpdateQueue = useCustomInstance<QueueDto>();

        return (
    id: number,
    updateQueueDto: UpdateQueueDto,
 ) => {
        return queuesControllerUpdateQueue(
          {url: `/api/queues/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateQueueDto
    },
          );
        }
      }
    


export const useQueuesControllerUpdateQueueMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerUpdateQueueHook>>>, TError,{id: number;data: UpdateQueueDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerUpdateQueueHook>>>, TError,{id: number;data: UpdateQueueDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const queuesControllerUpdateQueue =  useQueuesControllerUpdateQueueHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerUpdateQueueHook>>>, {id: number;data: UpdateQueueDto}> = (props) => {
          const {id,data} = props ?? {};

          return  queuesControllerUpdateQueue(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type QueuesControllerUpdateQueueMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerUpdateQueueHook>>>>
    export type QueuesControllerUpdateQueueMutationBody = UpdateQueueDto
    export type QueuesControllerUpdateQueueMutationError = void

    export const useQueuesControllerUpdateQueue = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerUpdateQueueHook>>>, TError,{id: number;data: UpdateQueueDto}, TContext>, }
) => {
    
      const mutationOptions = useQueuesControllerUpdateQueueMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useQueuesControllerRemoveQueueHook = () => {
        const queuesControllerRemoveQueue = useCustomInstance<void>();

        return (
    id: number,
 ) => {
        return queuesControllerRemoveQueue(
          {url: `/api/queues/${id}`, method: 'delete'
    },
          );
        }
      }
    


export const useQueuesControllerRemoveQueueMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerRemoveQueueHook>>>, TError,{id: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerRemoveQueueHook>>>, TError,{id: number}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const queuesControllerRemoveQueue =  useQueuesControllerRemoveQueueHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerRemoveQueueHook>>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  queuesControllerRemoveQueue(id,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type QueuesControllerRemoveQueueMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerRemoveQueueHook>>>>
    
    export type QueuesControllerRemoveQueueMutationError = unknown

    export const useQueuesControllerRemoveQueue = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerRemoveQueueHook>>>, TError,{id: number}, TContext>, }
) => {
    
      const mutationOptions = useQueuesControllerRemoveQueueMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useQueuesControllerGetAllUserOperateQueueHook = () => {
        const queuesControllerGetAllUserOperateQueue = useCustomInstance<UserDto[]>();

        return (
    id: number,
 signal?: AbortSignal
) => {
        return queuesControllerGetAllUserOperateQueue(
          {url: `/api/queues/${id}/user-operate-queue`, method: 'get', signal
    },
          );
        }
      }
    

export const getQueuesControllerGetAllUserOperateQueueQueryKey = (id: number,) => [`/api/queues/${id}/user-operate-queue`] as const;
  

    
export const useQueuesControllerGetAllUserOperateQueueQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>, TError = void>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getQueuesControllerGetAllUserOperateQueueQueryKey(id);

  const queuesControllerGetAllUserOperateQueue =  useQueuesControllerGetAllUserOperateQueueHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>> = ({ signal }) => queuesControllerGetAllUserOperateQueue(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type QueuesControllerGetAllUserOperateQueueQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>>
export type QueuesControllerGetAllUserOperateQueueQueryError = void

export const useQueuesControllerGetAllUserOperateQueue = <TData = Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>, TError = void>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useQueuesControllerGetAllUserOperateQueueHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useQueuesControllerGetAllUserOperateQueueQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useEnrollQueuesControllerCreateEnrollQueueHook = () => {
        const enrollQueuesControllerCreateEnrollQueue = useCustomInstance<EnrollQueueDto>();

        return (
    createEnrollQueueDto: CreateEnrollQueueDto,
 ) => {
        return enrollQueuesControllerCreateEnrollQueue(
          {url: `/api/enroll-queues`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: createEnrollQueueDto
    },
          );
        }
      }
    


export const useEnrollQueuesControllerCreateEnrollQueueMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerCreateEnrollQueueHook>>>, TError,{data: CreateEnrollQueueDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerCreateEnrollQueueHook>>>, TError,{data: CreateEnrollQueueDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const enrollQueuesControllerCreateEnrollQueue =  useEnrollQueuesControllerCreateEnrollQueueHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerCreateEnrollQueueHook>>>, {data: CreateEnrollQueueDto}> = (props) => {
          const {data} = props ?? {};

          return  enrollQueuesControllerCreateEnrollQueue(data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type EnrollQueuesControllerCreateEnrollQueueMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerCreateEnrollQueueHook>>>>
    export type EnrollQueuesControllerCreateEnrollQueueMutationBody = CreateEnrollQueueDto
    export type EnrollQueuesControllerCreateEnrollQueueMutationError = void

    export const useEnrollQueuesControllerCreateEnrollQueue = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerCreateEnrollQueueHook>>>, TError,{data: CreateEnrollQueueDto}, TContext>, }
) => {
    
      const mutationOptions = useEnrollQueuesControllerCreateEnrollQueueMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useEnrollQueuesControllerFindAllEnrollQueueHook = () => {
        const enrollQueuesControllerFindAllEnrollQueue = useCustomInstance<EnrollQueueDto[]>();

        return (
    params?: EnrollQueuesControllerFindAllEnrollQueueParams,
 signal?: AbortSignal
) => {
        return enrollQueuesControllerFindAllEnrollQueue(
          {url: `/api/enroll-queues`, method: 'get',
        params, signal
    },
          );
        }
      }
    

export const getEnrollQueuesControllerFindAllEnrollQueueQueryKey = (params?: EnrollQueuesControllerFindAllEnrollQueueParams,) => [`/api/enroll-queues`, ...(params ? [params]: [])] as const;
  

    
export const useEnrollQueuesControllerFindAllEnrollQueueQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>, TError = void>(params?: EnrollQueuesControllerFindAllEnrollQueueParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getEnrollQueuesControllerFindAllEnrollQueueQueryKey(params);

  const enrollQueuesControllerFindAllEnrollQueue =  useEnrollQueuesControllerFindAllEnrollQueueHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>> = ({ signal }) => enrollQueuesControllerFindAllEnrollQueue(params, signal);
    
      
      
   return  { queryKey, queryFn, ...queryOptions}}

export type EnrollQueuesControllerFindAllEnrollQueueQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>>
export type EnrollQueuesControllerFindAllEnrollQueueQueryError = void

export const useEnrollQueuesControllerFindAllEnrollQueue = <TData = Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>, TError = void>(
 params?: EnrollQueuesControllerFindAllEnrollQueueParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindAllEnrollQueueHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useEnrollQueuesControllerFindAllEnrollQueueQueryOptions(params,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useEnrollQueuesControllerFindOneEnrollQueueHook = () => {
        const enrollQueuesControllerFindOneEnrollQueue = useCustomInstance<EnrollQueueDto>();

        return (
    id: number,
 signal?: AbortSignal
) => {
        return enrollQueuesControllerFindOneEnrollQueue(
          {url: `/api/enroll-queues/${id}`, method: 'get', signal
    },
          );
        }
      }
    

export const getEnrollQueuesControllerFindOneEnrollQueueQueryKey = (id: number,) => [`/api/enroll-queues/${id}`] as const;
  

    
export const useEnrollQueuesControllerFindOneEnrollQueueQueryOptions = <TData = Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>, TError = void>(id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>, TError, TData>, }
): UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>, TError, TData> & { queryKey: QueryKey } => {
const {query: queryOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getEnrollQueuesControllerFindOneEnrollQueueQueryKey(id);

  const enrollQueuesControllerFindOneEnrollQueue =  useEnrollQueuesControllerFindOneEnrollQueueHook();
  
    const queryFn: QueryFunction<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>> = ({ signal }) => enrollQueuesControllerFindOneEnrollQueue(id, signal);
    
      
      
   return  { queryKey, queryFn, enabled: !!(id), ...queryOptions}}

export type EnrollQueuesControllerFindOneEnrollQueueQueryResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>>
export type EnrollQueuesControllerFindOneEnrollQueueQueryError = void

export const useEnrollQueuesControllerFindOneEnrollQueue = <TData = Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>, TError = void>(
 id: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerFindOneEnrollQueueHook>>>, TError, TData>, }

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const queryOptions = useEnrollQueuesControllerFindOneEnrollQueueQueryOptions(id,options)

  const query = useQuery(queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryOptions.queryKey;

  return query;
}


export const useEnrollQueuesControllerUpdateEnrollQueueHook = () => {
        const enrollQueuesControllerUpdateEnrollQueue = useCustomInstance<EnrollQueueDto>();

        return (
    id: number,
    updateEnrollQueueDto: UpdateEnrollQueueDto,
 ) => {
        return enrollQueuesControllerUpdateEnrollQueue(
          {url: `/api/enroll-queues/${id}`, method: 'patch',
      headers: {'Content-Type': 'application/json', },
      data: updateEnrollQueueDto
    },
          );
        }
      }
    


export const useEnrollQueuesControllerUpdateEnrollQueueMutationOptions = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerUpdateEnrollQueueHook>>>, TError,{id: number;data: UpdateEnrollQueueDto}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerUpdateEnrollQueueHook>>>, TError,{id: number;data: UpdateEnrollQueueDto}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const enrollQueuesControllerUpdateEnrollQueue =  useEnrollQueuesControllerUpdateEnrollQueueHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerUpdateEnrollQueueHook>>>, {id: number;data: UpdateEnrollQueueDto}> = (props) => {
          const {id,data} = props ?? {};

          return  enrollQueuesControllerUpdateEnrollQueue(id,data,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type EnrollQueuesControllerUpdateEnrollQueueMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerUpdateEnrollQueueHook>>>>
    export type EnrollQueuesControllerUpdateEnrollQueueMutationBody = UpdateEnrollQueueDto
    export type EnrollQueuesControllerUpdateEnrollQueueMutationError = void

    export const useEnrollQueuesControllerUpdateEnrollQueue = <TError = void,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerUpdateEnrollQueueHook>>>, TError,{id: number;data: UpdateEnrollQueueDto}, TContext>, }
) => {
    
      const mutationOptions = useEnrollQueuesControllerUpdateEnrollQueueMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
export const useEnrollQueuesControllerRemoveEnrollQueueHook = () => {
        const enrollQueuesControllerRemoveEnrollQueue = useCustomInstance<void>();

        return (
    id: number,
 ) => {
        return enrollQueuesControllerRemoveEnrollQueue(
          {url: `/api/enroll-queues/${id}`, method: 'delete'
    },
          );
        }
      }
    


export const useEnrollQueuesControllerRemoveEnrollQueueMutationOptions = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerRemoveEnrollQueueHook>>>, TError,{id: number}, TContext>, }
): UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerRemoveEnrollQueueHook>>>, TError,{id: number}, TContext> => {
 const {mutation: mutationOptions} = options ?? {};

      const enrollQueuesControllerRemoveEnrollQueue =  useEnrollQueuesControllerRemoveEnrollQueueHook()


      const mutationFn: MutationFunction<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerRemoveEnrollQueueHook>>>, {id: number}> = (props) => {
          const {id} = props ?? {};

          return  enrollQueuesControllerRemoveEnrollQueue(id,)
        }

        

 
   return  { mutationFn, ...mutationOptions }}

    export type EnrollQueuesControllerRemoveEnrollQueueMutationResult = NonNullable<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerRemoveEnrollQueueHook>>>>
    
    export type EnrollQueuesControllerRemoveEnrollQueueMutationError = unknown

    export const useEnrollQueuesControllerRemoveEnrollQueue = <TError = unknown,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<ReturnType<typeof useEnrollQueuesControllerRemoveEnrollQueueHook>>>, TError,{id: number}, TContext>, }
) => {
    
      const mutationOptions = useEnrollQueuesControllerRemoveEnrollQueueMutationOptions(options);
     
      return useMutation(mutationOptions);
    }
    
