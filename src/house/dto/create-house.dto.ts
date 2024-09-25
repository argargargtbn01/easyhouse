import { IsNumber, IsString, Min, Max, Length } from 'class-validator';

export class CreateHouseDto {
  @IsNumber()
  @Min(0)
  @Max(1)
  type: number;

  @IsString()
  @Length(1, 2048)
  name: string;

  @IsString()
  @Length(1, 2048)
  address: string;

  @IsNumber()
  @Min(-1)
  @Max(1)
  status: number;

  @IsNumber()
  @Min(0)
  area: number;

  @IsString()
  description: string;

  @IsString()
  @Length(1, 2048)
  image: string;

  @IsNumber()
  ownerId: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(0)
  numOfRooms: number;

  @IsNumber()
  @Min(0)
  numOfRoomsRented: number;

  @IsNumber()
  @Min(0)
  numOfRoomsPosted: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  isPosted: number;
}
