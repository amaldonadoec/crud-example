import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { CreateUserDto, UpdateUserDto } from '../../dtos/user.dto';
import UserRepository from '../../repositories/User.repository';
import { User } from './../../entities/User.entity';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  /**
   * Return all data from User table optionally with filters
   * @param {FilterUserDto} params
   * @returns {Promise<User[]>}
   */
  async findAll(options: IPaginationOptions): Promise<Pagination<User>> {
    return await this.userRepository.findAllPaginate(options);
  }

  /**
   * Return a User data found by id
   * @param {number} id
   * @returns {Promise<User>}
   */
  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  /**
   * Create a register in User table
   * @param {CreateUserDto} data
   * @returns {Promise<User>}
   */
  async create(data: CreateUserDto): Promise<User> {
    const newExample = this.userRepository.create(data);
    return await this.userRepository.save(newExample);
  }

  /**
   * Update a register with data passed by parameter and it found by id
   * @param {number} id
   * @param {UpdateUserDto} data
   * @returns {Promise<User>}
   */
  async update(id: number, data: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    this.userRepository.merge(user, data);
    return await this.userRepository.save(user);
  }

  /**
   * Set delete_at field from User register found by id
   * @param {number} id
   * @returns {Promise<UpdateResult>}
   */
  async remove(id: number): Promise<UpdateResult> {
    return await this.userRepository.softDelete(id);
  }
}
