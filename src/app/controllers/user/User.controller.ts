import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
} from './../../dtos/user.dto';
import { UserService } from '../../services/user/User.service';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../../entities/User.entity';
import { UpdateResult } from 'typeorm';

@ApiTags('user')
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: Logger,
  ) {}
  @Get()
  findAll(@Query() query: FilterUserDto): Promise<Pagination<User>> {
    this.logger.log(query, 'UserController.findAll');
    this.logger.error(query, 'User Controller', 'User Controller');
    const { limit, page } = query;
    return this.userService.findAll({ limit, page });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() payload: CreateUserDto): Promise<User> {
    return this.userService.create(payload);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, payload);
  }

  @Patch(':id')
  patch(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateUserDto,
  ): Promise<User> {
    return this.userService.update(id, payload);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<UpdateResult> {
    return this.userService.remove(id);
  }
}
