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
import { FindOptionsOrder, Repository } from 'typeorm';
import { TenantsRepository } from './tenants.repository';
import { plainToInstance } from 'class-transformer';
import { partialMapping, randomCodeTenant } from 'src/common/algorithm';
import { TenantDto } from './dto/tenant.dto';
import { ERROR_TYPE, transformError } from 'src/common/constant.error';
import { UsersService } from 'src/users/users.service';
import { FilterOperator } from 'src/common/filters.vm';
import { LoggerService } from 'src/logger/logger.service';
import { PaginateDto } from 'src/common/paginate.dto';

/**
 * TenantsService class for tenants service with CRUD operations for tenants and other operations
 */
@Injectable()
export class TenantsService {
  constructor(
    private readonly tenantRepository: TenantsRepository,
    private readonly userService: UsersService,
    private readonly log: LoggerService,
  ) {}

  /**
   * Create a new tenant with createTenantDto
   * @param createTenantDto  - CreateTenantDto object from request body
   * @returns  TenantDto object with created tenant data
   * @throws {BadRequestException} - if contactEmail is exist in database
   * @throws {BadRequestException} - if create user admin error
   * @throws {BadRequestException} - if create tenant error
   * @throws {BadRequestException} - if create user admin error
   *
   */
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
  /**
   * Find all tenants with search query params
   * @param search - search query params
   * @returns TenantDto[] object with found tenants data
   */
  async findAll(search: any): Promise<PaginateDto<TenantDto>> {
    // start create search
    const filterObj = new FilterOperator();
    // transform to filter
    Object.keys(search).forEach((key) => {
      if (key !== 'page' && key !== 'size' && key !== 'sort') {
        if (search[key] instanceof Array) {
          search[key].forEach((tmp: any) => {
            filterObj.addOperator(key, tmp);
          });
        } else {
          filterObj.addOperator(key, search[key]);
        }
      }
    });

    // transform to sort
    filterObj.sort = search?.sort;
    let tenants: Tenant[] = [];
    let totalCount: number;
    try {
      [tenants, totalCount] = await this.tenantRepository.findAndCount({
        where: filterObj.transformToQuery(),
        order: filterObj.parseSortToOrder(),
        take: search.size || 10,
        skip: (search.page - 1) * search.size || 1,
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

    const result = tenants.map((tenant) =>
      plainToInstance(TenantDto, tenant, {
        excludeExtraneousValues: true,
      }),
    );

    return new PaginateDto<TenantDto>(
      result,
      search.page,
      result.length === search.size ? search.size : result.length,
      totalCount,
    );
  }

  /**
   * Find one tenant with id
   * @param id - id of tenant
   * @returns TenantDto object with found tenant data
   * @throws {NotFoundException} - if id is not exist in database
   * @throws {BadRequestException} - if id is not valid
   */
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

  /**
   * Update tenant with id and updateTenantDto
   * @param id  - id of tenant
   * @param updateTenantDto - UpdateTenantDto object from request body
   * @returns TenantDto object with updated tenant data
   * @throws {NotFoundException} - if id is not exist in database
   * @throws {BadRequestException} - if id is not valid
   */
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

    // check field exist then update or using old value
    tenant = partialMapping(tenant, updateTenantDto) as Tenant;

    return plainToInstance(TenantDto, this.tenantRepository.save(tenant), {
      excludeExtraneousValues: true,
    });
  }

  /**
   * Remove tenant with id
   * @param id - id of tenant
   * @returns TenantDto object with removed tenant data
   *
   */
  remove(id: number) {
    return this.tenantRepository.delete(id);
  }

  /**
   * Update tenant with id and updateTenantDto
   * @param userId  - userId
   * @param updateTenantDto - UpdateTenantDto object from request body
   * @returns TenantDto object with updated tenant data
   */
  async updateMyTenant(userId: number, updateTenantDto: UpdateTenantDto) {
    // check permission can update
    const resUser = await this.userService.findOne(userId);
    if (resUser.email !== updateTenantDto.contactEmail) {
      throw new BadRequestException(
        'Bạn không có quyền cập nhật thông tin này',
      );
    }

    return this.update(updateTenantDto.id, updateTenantDto);
  }
}
