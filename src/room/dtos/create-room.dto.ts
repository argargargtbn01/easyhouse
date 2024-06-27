import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { StatusEnum } from 'src/common/types/status.enum';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  house_id: number;

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
}
