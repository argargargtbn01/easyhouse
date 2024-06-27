import { IsArray, IsOptional } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsArray()
  roleIds: number[];

  @IsOptional()
  @IsArray()
  policyIds: number[];
}
