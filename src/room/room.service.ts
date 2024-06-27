import { BadRequestException, Injectable } from '@nestjs/common';
import { DeleteResult, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Room } from './entities/room.entity';
import { CreateRoomDto } from './dtos/create-room.dto';
import { UpdateRoomDto } from './dtos/update-room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private readonly roomRepo: Repository<Room>,
  ) {}

  async findAll(): Promise<Room[]> {
    return await this.roomRepo.find();
  }

  async findById(id: number): Promise<Room> {
    return await this.roomRepo.findOne({
      where: {
        id,
      },
    });
  }

  async create(user: User, createRoomDto: CreateRoomDto): Promise<Room> {
    const name = createRoomDto.name;
    const checkRoomNameExist = await this.roomRepo.findOne({
      where: {
        name,
      },
    });
    if (checkRoomNameExist) {
      throw new BadRequestException('Room name already exists');
    }
    return await this.roomRepo.save({ owner_id: user, ...createRoomDto });
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<Room> {
    const Room = await this.roomRepo.findOne({
      where: {
        id,
      },
    });
    Object.assign(Room, updateRoomDto);
    return await this.roomRepo.save(Room);
  }

  async delete(id: number): Promise<DeleteResult> {
    return await this.roomRepo.delete(id);
  }
}
