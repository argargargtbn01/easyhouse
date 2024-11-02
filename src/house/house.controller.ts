import { Controller, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { House } from './entities/house.entity';
import { User } from '../user/entities/user.entity';
import { CreateHouseDto } from './dto/create-house.dto';
import { UpdateHouseDto } from './dto/update-house.dto';

@Controller()
export class HouseController {
  constructor(
    @InjectRepository(House)
    private houseRepository: Repository<House>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createHouseDto: CreateHouseDto): Promise<House> {
    const owner = await this.userRepository.findOne({ where: { id: createHouseDto.ownerId } });
    if (!owner) {
      throw new NotFoundException(`User with ID ${createHouseDto.ownerId} not found`);
    }

    const house = this.houseRepository.create({
      ...createHouseDto,
      owner,
      createdTime: Date.now(),
    });

    return this.houseRepository.save(house);
  }

  async findAll(): Promise<House[]> {
    return this.houseRepository.find({ relations: ['owner', 'rooms'] });
  }

  async findOne(id: number): Promise<House> {
    const house = await this.houseRepository.findOne({
      where: { id },
      relations: ['owner', 'rooms'],
    });
    if (!house) {
      throw new NotFoundException(`House with ID ${id} not found`);
    }
    return house;
  }

  async update(id: number, updateHouseDto: UpdateHouseDto): Promise<House> {
    const house = await this.findOne(id);

    if (updateHouseDto.ownerId && updateHouseDto.ownerId !== house.owner.id) {
      const newOwner = await this.userRepository.findOne({ where: { id: updateHouseDto.ownerId } });
      if (!newOwner) {
        throw new NotFoundException(`User with ID ${updateHouseDto.ownerId} not found`);
      }
      house.owner = newOwner;
    }

    Object.assign(house, updateHouseDto);
    return this.houseRepository.save(house);
  }

  async remove(id: number): Promise<void> {
    const house = await this.findOne(id);
    await this.houseRepository.remove(house);
  }
}
