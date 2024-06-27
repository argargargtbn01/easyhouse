import { BadRequestException, Injectable } from '@nestjs/common';
import { House } from './entities/house.entity';
import { DeleteResult, Repository } from 'typeorm';
import { CreateHouseDto } from './dtos/create-house.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateHouseDto } from './dtos/update-house.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class HouseService {
  constructor(
    @InjectRepository(House)
    private readonly houseRepo: Repository<House>,
  ) {}

  async findAll(): Promise<House[]> {
    return await this.houseRepo.find();
  }
  async findById(id: number): Promise<House> {
    return await this.houseRepo.findOne({
      where: {
        id,
      },
    });
  }

  async create(user: User, createHouseDto: CreateHouseDto): Promise<House> {
    const name = createHouseDto.name;
    const checkHouseNameExist = await this.houseRepo.findOne({
      where: {
        name,
      },
    });
    if (checkHouseNameExist) {
      throw new BadRequestException('House name already exists');
    }
    return await this.houseRepo.save({ owner_id: user, ...createHouseDto });
  }

  async update(id: number, updateHouseDto: UpdateHouseDto): Promise<House> {
    const house = await this.houseRepo.findOne({
      where: {
        id,
      },
    });
    Object.assign(house, updateHouseDto);
    return await this.houseRepo.save(house);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.houseRepo.delete(id);
  }
}
