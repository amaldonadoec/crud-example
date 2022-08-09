import { HttpModule } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Pagination } from 'nestjs-typeorm-paginate';
import {
  CreateUserDto,
  FilterUserDto,
  UpdateUserDto,
} from './../../dtos/user.dto';
import { UpdateResult } from 'typeorm';
import { User } from './../../entities/User.entity';

import { UserService } from './User.service';

describe('UserService', () => {
  let service: UserService;
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

  const mockUserRepository = {
    findAllPaginate: jest.fn(async (params: FilterUserDto) => paginationResult),
    findOne: jest.fn(async (id: number) => userMock),
    create: jest.fn(async (payload: CreateUserDto) => userMock),
    update: jest.fn(async (id: number, payload: UpdateUserDto) => userMock),
    save: jest.fn(async (user: User) => user),
    merge: jest.fn(async (user: User, data: UpdateUserDto) => user),
    softDelete: jest.fn(async (id: number) => updateResult),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
      imports: [HttpModule],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('FindAll function', () => {
    it('should return an array of users', async () => {
      expect(await service.findAll({ limit: 2, page: 1 })).toBe(
        paginationResult,
      );
    });
  });
  describe('FindOne function', () => {
    it('should return an user', async () => {
      expect(await service.findOne(1)).toBe(userMock);
    });
  });

  describe('Create function', () => {
    it('should return an user', async () => {
      expect(await service.create(userMock)).toBe(userMock);
    });
  });

  describe('Update function', () => {
    it('should return an user', async () => {
      expect(await service.update(1, userMock)).toBe(userMock);
    });
  });
  describe('Delete function', () => {
    it('should return an updated object', async () => {
      expect(await service.remove(1)).toBe(updateResult);
    });
  });
});
