import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly tenantRepository: TenantsRepository,
  ) {}

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

    // check role
    if (createUserDto.role === RoleEnum.SUPER_ADMIN) {
      throw new BadRequestException(
        `Bạn không có quyền tạo tài khoản ${RoleEnum.SUPER_ADMIN}`,
      );
    }

    // TODO: check role login to create role

    const user = plainToInstance(User, {
      ...createUserDto,
      tenant: { tenantCode: createUserDto.tenantCode },
    });

    const savedUser = await this.userRepository.save(user);
    return plainToInstance(UserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  // using for register from tenant
  async createFromTenant(tenantObj: Tenant): Promise<UserDto> {
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

    user.status = true;
    user.role = RoleEnum.ADMIN;
    user.fullName = tenantObj.name;
    user.note = 'Tài khoản được tạo tự động từ tenant';
    user.isWorking = true;

    // random a password when create
    user.password = randomPassword();

    const savedUser = await this.userRepository.save(user);

    // TODO: send email to user

    return plainToInstance(UserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepository.find({
      relations: ['tenant'],
    });

    return users.map((user: User) =>
      plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
      }),
    );
  }

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

  remove(id: number) {
    // return `This action removes a #${id} user`;
    return this.userRepository.delete(id);
  }
}
