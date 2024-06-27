import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { HouseTypeEnum } from '../types/house-type.enum';
import { StatusEnum } from '../../common/types/status.enum';
import { IsPostedEnum } from '../../common/types/is-posted.enum';

export class CreateHouseDto {
  @IsNotEmpty()
  @IsEnum(HouseTypeEnum)
  type: HouseTypeEnum;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  address: string;

  @IsOptional()
  @IsEnum(StatusEnum)
  status: StatusEnum;

  @IsOptional()
  area: number;

  @IsOptional()
  description: string;

  @IsOptional()
  image: string;

  @IsOptional()
  price: number;

  @IsOptional()
  num_of_rooms: number;

  @IsOptional()
  num_of_rooms_rented: number;

  @IsOptional()
  @IsEnum(IsPostedEnum)
  num_of_rooms_posted: IsPostedEnum;
}
