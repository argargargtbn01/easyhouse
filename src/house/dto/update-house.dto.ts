import { IsNumber, IsOptional } from 'class-validator';
import { CreateHouseDto } from './create-house.dto';

export class UpdateHouseDto extends CreateHouseDto {
  @IsOptional()
  @IsNumber()
  id: number;
}
