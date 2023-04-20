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
  Req,
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
import { Request } from 'express';

/**
 * UsersController class for users controller with CRUD operations for users
 */

@Controller('users')
@UseGuards(RoleGuard)
@HasRole(RoleEnum.ADMIN, RoleEnum.SUPER_ADMIN)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Create a new user with createUserDto
   * @param createUserDto - CreateUserDto object from request body
   * @returns UserDto object with created user data
   * @throws {BadRequestException} - if createUserDto is invalid
   * @throws {InternalServerErrorException} - if error occurs during creating user
   * @throws {NotFoundException} - if tenant with code from createUserDto.tenantCode not found
   */
  @ApiTags('users')
  @Post()
  @ApiCreatedResponse({ type: UserDto })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    return this.usersService.create(createUserDto);
  }

  /**
   * Find all users with search query params
   * @param search - search query params
   * @returns array of UserDto objects with users data
   * @throws {BadRequestException} - if search query params is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding users
   * @throws {NotFoundException} - if tenant with code from search.tenantCode not found
   */
  @ApiTags('users')
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

  /**
   * Find one user by id
   * @param id - user id
   * @returns UserDto object with user data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during finding user
   * @throws {NotFoundException} - if user not found or tenant with code from search.tenantCode not found
   */
  @ApiTags('users')
  @Get(':id')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(+id);
  }

  /**
   * Update user by id
   * @param id - user id
   * @param updateUserDto - UpdateUserDto object from request body
   * @returns UserDto object with updated user data
   * @throws {BadRequestException} - if id or updateUserDto is invalid
   * @throws {InternalServerErrorException} - if error occurs during updating user
   *  @throws {NotFoundException} - if user not found or tenant with code from search.tenantCode not found
   */
  @ApiTags('users')
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

  /**
   * Delete user by id
   * @param id - user id
   * @returns UserDto object with deleted user data
   * @throws {BadRequestException} - if id is invalid
   * @throws {InternalServerErrorException} - if error occurs during deleting user
   * @throws {NotFoundException} - if user not found or tenant with code from search.tenantCode not found
   */
  @ApiTags('users')
  @Delete(':id')
  @ApiBadRequestResponse({ description: 'Bad Request' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiOkResponse({ description: 'OK' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(+id);
  }

  // get me
  @ApiTags('profile')
  @Get('me')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  getMe(@Req() req: any) {
    // get me
    return this.usersService.getMe(req?.user?.id);
  }
  // update me
  /**
   * api for update profile user
   * @param req request user send
   * @param updateUserDto data update
   * @returns new data user
   */
  @ApiTags('profile')
  @Patch('me')
  @ApiOkResponse({ type: UserDto })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiBadRequestResponse({ description: 'Bad Request' })
  updateMe(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    // remove field not update
    delete updateUserDto.tenantCode;
    delete updateUserDto.email;
    delete updateUserDto.id;
    return this.usersService.update(req?.user?.id, updateUserDto);
  }
}
