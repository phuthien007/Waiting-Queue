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

@ApiTags('tenants')
@Controller('tenants')
@UseGuards(RoleGuard)
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @ApiCreatedResponse({ type: TenantDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async create(@Body() createTenantDto: CreateTenantDto): Promise<TenantDto> {
    return this.tenantsService.create(createTenantDto);
  }

  @Get()
  @ApiOkResponse({ type: [TenantDto] })
  @ApiQuery({
    name: 'search',
    required: false,
    type: FilterOperator,
    description: 'Search query',
  })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll(@Query() search: any) {
    return this.tenantsService.findAll(search);
  }

  @Get(':id')
  @ApiOkResponse({ type: TenantDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tenantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: TenantDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  update(
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

  @Delete(':id')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiOkResponse({ description: 'OK' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tenantsService.remove(+id);
  }
}
