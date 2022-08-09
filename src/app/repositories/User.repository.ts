import { DataSource, Repository } from 'typeorm';
import { User } from '../entities/User.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { Injectable } from '@nestjs/common';

@Injectable()
export default class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }
  async findAllPaginate(
    options: IPaginationOptions,
  ): Promise<Pagination<User>> {
    const query = this.createQueryBuilder('user');
    return paginate<User>(query, options);
  }
}
