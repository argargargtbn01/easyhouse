import { IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsOptional()
  @IsString()
  uid: string;

  @IsOptional()
  @IsString()
  email: string;
}
