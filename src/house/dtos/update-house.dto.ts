import { CreateHouseDto } from './create-house.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateHouseDto extends PartialType(CreateHouseDto) {}
