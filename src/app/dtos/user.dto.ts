import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { DocumentValidation, IsRealName } from '../validators/Util.validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @IsRealName()
  @MinLength(3)
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsRealName()
  @MinLength(3)
  @ApiProperty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  @IsEmail()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  @DocumentValidation()
  cc: number;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FilterUserDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty()
  limit?: number = 10;

  @IsOptional()
  @Min(1)
  @ApiProperty()
  page?: number = 1;
}
