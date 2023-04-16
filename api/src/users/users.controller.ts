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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UserDto } from './dto/user.dto';
import { FilterOperator } from 'src/common/filters.vm';
import { RoleGuard } from 'src/auth/role.guard';
import { HasRole } from 'src/common/decorators';
import { RoleEnum } from 'src/common/enum';

@ApiTags('users')
@Controller('users')
@UseGuards(RoleGuard)
@HasRole(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
    // return null;
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
    type: FilterOperator,
    description: 'Search query',
  })
  @ApiOkResponse({ type: [UserDto] })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findAll(@Query() search: any): Promise<UserDto[]> {
    return this.usersService.findAll(search);
    // return null;
  }

  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // remove field not update
    delete updateUserDto.tenantCode;
    delete updateUserDto.email;
    delete updateUserDto.id;
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiOkResponse({ description: 'OK' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }
}
