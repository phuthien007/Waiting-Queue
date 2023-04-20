import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TenantDto } from './dto/tenant.dto';
import { FilterOperator } from 'src/common/filters.vm';
import { RoleGuard } from 'src/auth/role.guard';

/**
 * TenantsController class for tenants controller with CRUD operations for tenants and other controller methods
 */
@ApiTags('tenants')
@Controller('tenants')
@UseGuards(RoleGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  /**
   * Create a new tenant with createTenantDto
   * @param createTenantDto - CreateTenantDto object from request body
   * @returns TenantDto object with created tenant data
   * @throws {BadRequestException} - if createTenantDto is invalid
   * @throws {InternalServerErrorException} - if error occurs during creating tenant
   * @throws {NotFoundException} - if event with id from createTenantDto.eventId not found
   */
  @Post()
  @ApiCreatedResponse({ type: TenantDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async createTenant(
    @Body() createTenantDto: CreateTenantDto,
  ): Promise<TenantDto> {
    return this.tenantsService.create(createTenantDto);
  }

  /**
   * Find all tenants with search query params
   * @param search - search query params
   * @returns array of TenantDto objects with tenants data
   * @throws {BadRequestException} - if search query params is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding tenants
   */
  @Get()
  @ApiOkResponse({ type: [TenantDto] })
  @ApiQuery({
    name: 'search',
    required: false,
    type: FilterOperator,
    description: 'Search query',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAllTenant(@Query() search: any) {
    return this.tenantsService.findAll(search);
  }

  /**
   * Find one tenant by id
   * @param id  - id of tenant
   * @returns  TenantDto object with tenant data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding tenant
   * @throws {NotFoundException} - if tenant with id not found
   */
  @Get(':id')
  @ApiOkResponse({ type: TenantDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOneTenant(@Param('id', ParseIntPipe) id: number) {
    return this.tenantsService.findOne(id);
  }

  /**
   * Update tenant by id with updateTenantDto
   * @param id - id of tenant
   * @param updateTenantDto  - UpdateTenantDto object from request body
   * @returns  TenantDto object with updated tenant data
   *  @throws {BadRequestException} - if id or updateTenantDto is invalid
   * @throws {InternalServerErrorException} - if error occurs during updating tenant
   * @throws {NotFoundException} - if tenant with id not found
   */
  @Patch(':id')
  @ApiOkResponse({ type: TenantDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  updateTenant(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTenantDto: UpdateTenantDto,
  ): Promise<TenantDto> {
    // remove field not can update
    delete updateTenantDto.tenantCode;
    delete updateTenantDto.contactEmail;
    delete updateTenantDto.createdAt;
    delete updateTenantDto.updatedAt;

    // start update
    return this.tenantsService.update(+id, updateTenantDto);
  }

  /**
   * Delete tenant by id
   * @param id - id of tenant
   * @returns  TenantDto object with deleted tenant data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during deleting tenant
   * @throws {NotFoundException} - if tenant with id not found
   */
  @Delete(':id')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiOkResponse({ description: 'OK' })
  removeTenant(@Param('id', ParseIntPipe) id: number) {
    return this.tenantsService.remove(+id);
  }
}
