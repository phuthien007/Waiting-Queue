import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Tenant } from './entities/tenants.entity';
import { Repository } from 'typeorm';
import { TenantsRepository } from './tenants.repository';
import { plainToInstance } from 'class-transformer';
import { partialMapping, randomCodeTenant } from 'src/common/algorithm';
import { TenantDto } from './dto/tenant.dto';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { UsersService } from 'src/users/users.service';
import { FilterOperator } from 'src/common/filters.vm';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantRepository: TenantsRepository,
    private readonly userService: UsersService,
    private readonly log: LoggerService,
  ) {}
  async create(createTenantDto: CreateTenantDto): Promise<TenantDto> {
    // return 'This action adds a new tenant';
    // mapping to entity

    // validate  contactEmail

    // TODO: transaction when create tenant and user admin error

    const tenantObjEmail = await this.tenantRepository.exist({
      where: { contactEmail: createTenantDto.contactEmail },
    });
    if (tenantObjEmail)
      throw new BadRequestException(
        transformError(
          `ContactEmail: ${createTenantDto.contactEmail}`,
          ERROR_TYPE.EXIST,
        ),
      );

    const tenant = plainToInstance(Tenant, createTenantDto);
    tenant.tenantCode = randomCodeTenant();
    const savedTenant = this.tenantRepository.save(tenant);

    // TODO: create user admin for tenant
    const resUser = await this.userService.createFromTenant(tenant);

    if (!resUser) {
      throw new BadRequestException(
        'Có lỗi xảy ra khi tạo tài khoản admin cho tenant',
      );
    }

    return plainToInstance(TenantDto, savedTenant, {
      excludeExtraneousValues: true,
    });
  }

  // TODO: search
  async findAll(search: any): Promise<TenantDto[]> {
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
    let tenants: Tenant[] = [];
    try {
      tenants = await this.tenantRepository.find({
        where: filterObj.transformToQuery(),
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

    return tenants.map((tenant) =>
      plainToInstance(TenantDto, tenant, {
        excludeExtraneousValues: true,
      }),
    );
    // return `This action returns all tenants`;
  }

  async findOne(id: number): Promise<TenantDto> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
    });
    // return plainToInstance(TenantDto, tenant);
    if (!tenant) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }
    return plainToInstance(TenantDto, tenant, {
      excludeExtraneousValues: true,
    });
    // return `This action returns a #${id} tenant`;
  }

  async update(
    id: number,
    updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDto> {
    // check exist id
    let tenant = await this.tenantRepository.findOne({
      where: { id },
    });
    if (!tenant) {
      throw new NotFoundException(
        transformError(`Id: ${id}`, ERROR_TYPE.NOT_FOUND),
      );
    }

    // mapping to entity
    // const tenantUpdate = plainToInstance(Tenant, updateTenantDto);

    // check field exist then update or using old value
    tenant = partialMapping(tenant, updateTenantDto) as Tenant;

    return plainToInstance(TenantDto, this.tenantRepository.save(tenant), {
      excludeExtraneousValues: true,
    });
  }

  remove(id: number) {
    return this.tenantRepository.delete(id);
  }
}
