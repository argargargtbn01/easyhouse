import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { HouseService } from './house.service';
import { DeleteResult } from 'typeorm';
import { House } from './entities/house.entity';
import { CreateHouseDto } from './dtos/create-house.dto';
import { UpdateHouseDto } from './dtos/update-house.dto';
import { UserDecorator } from 'src/user/decorators/user.decorator';

@Controller('house')
export class HouseController {
  constructor(private readonly houseService: HouseService) {}
  @Get()
  @UseGuards(FirebaseAuthGuard)
  async findAll(): Promise<House[]> {
    return this.houseService.findAll();
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async findById(@Req() request: Request, @Param('id') id: number): Promise<Partial<House>> {
    const House = await this.houseService.findById(id);
    return House;
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(@UserDecorator() user, @Body() createHouseDto: CreateHouseDto): Promise<any> {
    return this.houseService.create(user, createHouseDto);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(@Param('id') id: number, @Body() updateHouseDto: UpdateHouseDto): Promise<any> {
    return this.houseService.update(id, updateHouseDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.houseService.delete(id);
  }
}
