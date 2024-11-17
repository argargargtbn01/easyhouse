import { IsString, IsOptional, IsNumber, IsDate, Length, IsEnum, IsEmail } from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  TENANT = 'tenant',
}

export class CreateUserDto {
  @IsEmail()
  @Length(1, 200)
  email: string;

  @IsString()
  @Length(1, 200)
  password: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // name: string;

  // @IsOptional()
  // @IsOptional()
  // @IsString()
  // @Length(1, 20)
  // phoneNumber: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 2048)
  // avatar?: string;

  // @IsOptional()
  // @IsDate()
  // dateOfBirth?: Date;

  // @IsOptional()
  // @IsNumber()
  // gender: number;

  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // hometown?: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // city?: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // district?: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 500)
  // address?: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // facebook?: string;

  // @IsOptional()
  // @IsString()
  // @Length(1, 200)
  // telegram?: string;

  // @IsOptional()
  // @IsEnum(UserRole)
  // role: UserRole;
}
