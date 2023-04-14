import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class TenantsService {
  constructor(private readonly tenantRepository: TenantsRepository) {}
  async create(createTenantDto: CreateTenantDto): Promise<TenantDto> {
    // return 'This action adds a new tenant';
    // mapping to entity

    // validate  contactEmail

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
    return plainToInstance(TenantDto, savedTenant, {
      excludeExtraneousValues: true,
    });
  }

  // TODO: search
  async findAll(): Promise<TenantDto[]> {
    const tenants = await this.tenantRepository.find();

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
