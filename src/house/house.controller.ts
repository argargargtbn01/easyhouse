import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { House } from './entities/house.entity';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';
import { HouseService } from './house.service';

@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}

  @Get()
  async findAll(): Promise<House[]> {
    return this.houseService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<House> {
    return this.houseService.findOne(id);
  }

  @Post()
  async createHouse(@Body() createHouseDto: CreateHouseDto) {
    return this.houseService.create(createHouseDto);
  }
}
