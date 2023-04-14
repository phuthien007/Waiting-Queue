import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TenantDto } from './dto/tenant.dto';

@ApiTags('tenants')
@Controller('tenants')
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
  @ApiBadRequestResponse({ description: 'Bad Request' })
  async findAll() {
    return this.tenantsService.findAll();
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
