import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './dto/user.dto';
import { UsersRepository } from './users.repository';
import { plainToInstance } from 'class-transformer';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { TenantsRepository } from 'src/tenants/tenants.repository';
import { RoleEnum, commonEnum } from 'src/common/enum';
import { partialMapping, randomPassword } from 'src/common/algorithm';
import { Tenant } from 'src/tenants/entities/tenants.entity';
import { FilterOperator } from 'src/common/filters.vm';
import { LoggerService } from 'src/logger/logger.service';
import { TenantDto } from 'src/tenants/dto/tenant.dto';
import { MailService } from 'src/mail/mail.service';

/**
 * UsersService class for users service with CRUD operations for users and other operations
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly tenantRepository: TenantsRepository,
    private readonly log: LoggerService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Create a new user with createUserDto
   * @param createUserDto  - CreateUserDto object from request body
   * @returns  UserDto object with created user data
   * @throws {BadRequestException} - if email is exist in database
   * @throws {BadRequestException} - if tenantCode is not exist in database
   * @throws {BadRequestException} - if role is SUPER_ADMIN
   */
  // using for auth login
  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    // check tenant exist
    const tenantObj = await this.tenantRepository.exist({
      where: { tenantCode: createUserDto.tenantCode },
    });
    if (!tenantObj)
      throw new BadRequestException(
        transformError(
          `TenantCode: ${createUserDto.tenantCode}`,
          ERROR_TYPE.NOT_FOUND,
        ),
      );
    // check email exist in tenant
    const userObjEmail = await this.userRepository.exist({
      where: {
        email: createUserDto.email,
        tenant: {
          tenantCode: createUserDto.tenantCode,
        },
      },
    });
    if (userObjEmail)
      throw new BadRequestException(
        transformError(`Email: ${createUserDto.email}`, ERROR_TYPE.EXIST),
      );
    // TODO: check role login to create role

    // check role
    if (createUserDto.role === RoleEnum.SUPER_ADMIN) {
      throw new BadRequestException(
        `Bạn không có quyền tạo tài khoản ${RoleEnum.SUPER_ADMIN}`,
      );
    }

    const user = plainToInstance(User, {
      ...createUserDto,
      tenant: { tenantCode: createUserDto.tenantCode },
    });

    const savedUser = await this.userRepository.save(user);
    return plainToInstance(UserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Find all users with search
   * @param tenantObj - Tenant object from request body
   * @returns UserDto object with created user data
   * @throws {BadRequestException} - if tenantCode is not exist in database
   *  @throws {BadRequestException} - if role is SUPER_ADMIN
   * @throws {BadRequestException} - if email is exist in database
   */
  // using for register from tenant
  async createFromTenant(
    tenantObj: Tenant,
    password?: string,
  ): Promise<UserDto> {
    // check tenant exist

    const user = new User();
    if (!tenantObj)
      throw new BadRequestException(
        transformError(
          `TenantCode: ${tenantObj.tenantCode}`,
          ERROR_TYPE.NOT_FOUND,
        ),
      );
    user.tenant = tenantObj;
    // email for each tenant always unique so no need to check email exist in tenant
    user.email = tenantObj.contactEmail;

    // if (userObjEmail)
    //   throw new BadRequestException(
    //     transformError(`Email: ${createUserDto.email}`, ERROR_TYPE.EXIST),
    //   );

    // check role is not nessary because role is always ADMIN when register from tenant
    // if (createUserDto.role === RoleEnum.SUPER_ADMIN) {
    //   throw new BadRequestException(
    //     `Bạn không có quyền tạo tài khoản ${RoleEnum.SUPER_ADMIN}`,
    //   );
    // }

    user.status = commonEnum.ACTIVE;
    user.role = RoleEnum.ADMIN;
    user.fullName = tenantObj.name;
    user.note = 'Tài khoản được tạo tự động từ tenant';
    user.isWorking = false;

    // random a password when create
    const randomRaw = randomPassword();
    user.password = randomRaw;

    const savedUser = await this.userRepository.save(user);

    // TODO: send email to user if not have password
    this.mailService.sendRegisterTenantSuccess(
      savedUser,
      randomRaw,
      tenantObj.tenantCode,
    );

    return plainToInstance(UserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Find all users with search
   * @param search - search object from request body
   * @returns UserDto object with created user data
   * @throws {BadRequestException} - if search is not valid
   */
  async findAll(search: any, tenantCode?: string): Promise<UserDto[]> {
    // start create search
    const filterObj = new FilterOperator();
    // transform to filter
    Object.keys(search).forEach((key) => {
      if (search[key] instanceof Array) {
        search[key].forEach((tmp: any) => {
          filterObj.addOperator(key, tmp);
        });
      } else {
        filterObj.addOperator(key, search[key]);
      }
    });

    let users: User[] = [];
    try {
      users = await this.userRepository.find({
        relations: ['tenant'],
        where: {
          ...filterObj.transformToQuery(),
          tenant: {
            tenantCode: tenantCode,
          },
        },
      });
    } catch (error) {
      this.log.error(error);

      throw new BadRequestException(
        transformError(
          `Search: ${JSON.stringify(search)}`,
          ERROR_TYPE.IN_VALID,
        ),
      );
    }

    return users.map((user: User) =>
      plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

  /**
   * Find one user by id
   * @param id - id of user
   * @returns  UserDto object with created user data
   * @throws {NotFoundException} - if id is not exist in database
   */
  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!user)
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    return plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Update user by id
   * @param id - id of user
   * @param updateUserDto - update user object from request body
   * @returns UserDto object with created user data
   * @throws {NotFoundException} - if id is not exist in database
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    let data = await this.userRepository.findOne({
      where: { id },
    });
    if (!data) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    if (
      data.role !== RoleEnum.SUPER_ADMIN &&
      updateUserDto.role === RoleEnum.SUPER_ADMIN
    ) {
      throw new BadRequestException(
        `Bạn không thể phân quyền tài khoản ${RoleEnum.SUPER_ADMIN}`,
      );
    }

    data = partialMapping(data, updateUserDto) as User;

    return plainToInstance(UserDto, this.userRepository.save(data), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Remove user by id
   * @param id - id of user
   * @returns UserDto object with created user data
   */
  remove(id: number) {
    // return `This action removes a #${id} user`;
    return this.userRepository.delete(id);
  }

  // get me
  /**
   * Get me by id of user from auth token
   * @returns UserDto object with profile of this user
   */
  async getMe(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!user)
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    const resToInstance = plainToInstance(UserDto, user, {
      excludeExtraneousValues: true,
    });
    resToInstance.tenant = plainToInstance(TenantDto, user.tenant, {
      excludeExtraneousValues: true,
    });
    return {
      ...resToInstance,
      isOwnerTenant: user.tenant.contactEmail === user.email,
    };
  }
}
