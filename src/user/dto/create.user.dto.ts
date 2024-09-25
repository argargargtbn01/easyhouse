import { IsString, IsOptional, IsNumber, IsDate, Length, IsEnum } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  TENANT = 'tenant',
}

export class CreateUserDto {
  @IsString()
  uid: string;

  @IsString()
  @Length(1, 200)
  name: string;

  @IsString()
  @Length(1, 20)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @Length(1, 2048)
  avatar?: string;

  @IsOptional()
  @IsDate()
  dateOfBirth?: Date;

  @IsNumber()
  gender: number;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  hometown?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  city?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  district?: string;

  @IsOptional()
  @IsString()
  @Length(1, 500)
  address?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  facebook?: string;

  @IsOptional()
  @IsString()
  @Length(1, 200)
  telegram?: string;

  @IsEnum(UserRole)
  role: UserRole;
}
