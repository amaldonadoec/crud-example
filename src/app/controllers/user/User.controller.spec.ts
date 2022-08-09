import { HttpModule, Logger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UpdateResult } from 'typeorm';
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
} from './../../dtos/user.dto';
import { User } from './../../entities/User.entity';
import { UserService } from './../../services/user/User.service';
import { UserController } from './../user/User.controller';

describe('UserController', () => {
  let controller: UserController;
  const userMock: User = {
    id: 1,
    name: 'Armando Maldonado',
    lastName: 'Maldonado',
    email: '',
    phoneNumber: '',
    cc: 121212,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const paginationResult: Pagination<User> = {
    items: [userMock, userMock],
    meta: {
      totalItems: 3,
      itemCount: 2,
      itemsPerPage: 2,
      totalPages: 2,
      currentPage: 1,
    },
  };

  const updateResult: UpdateResult = {
    generatedMaps: [],
    raw: [],
    affected: 1,
  };

  const mockUserService = {
    findAll: jest.fn(async (params: FilterUserDto) => paginationResult),
    findOne: jest.fn(async (id: number) => userMock),
    create: jest.fn(async (payload: CreateUserDto) => userMock),
    update: jest.fn(async (id: number, payload: UpdateUserDto) => userMock),
    remove: jest.fn(async (id: number) => updateResult),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [Logger, UserService],
      imports: [HttpModule],
    })
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('FindAll function', () => {
    it('should return an array of users', async () => {
      expect(await controller.findAll({ limit: 2, page: 1 })).toBe(
        paginationResult,
      );
    });
    it('should return an array of users without query parameters', async () => {
      expect(await controller.findAll({})).toBe(paginationResult);
    });
  });
  describe('FindOne function', () => {
    it('should return an user', async () => {
      expect(await controller.findOne(1)).toBe(userMock);
    });
  });

  describe('Create function', () => {
    it('should return an user', async () => {
      expect(await controller.create(userMock)).toBe(userMock);
    });
  });

  describe('Update function', () => {
    it('should return an user', async () => {
      expect(await controller.update(1, userMock)).toBe(userMock);
    });
  });
  describe('Delete function', () => {
    it('should return an updated object', async () => {
      expect(await controller.remove(1)).toBe(updateResult);
    });
  });
});
