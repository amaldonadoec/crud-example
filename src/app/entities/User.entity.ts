import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'varchar', length: 64 })
  email: string;

  @Column({ type: 'varchar', length: 14 })
  phoneNumber: string;

  @Column({ type: 'varchar', width: 25 })
  cc: number;

  @Exclude()
  @CreateDateColumn({
    name: 'createAt',
    type: 'timestamp',
    nullable: false,
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    name: 'updatedAt',
    type: 'timestamp',
    nullable: false,
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    name: 'deletedAt',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date | null;
}
