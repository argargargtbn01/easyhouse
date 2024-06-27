import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepo.find();
  }
  async findById(id: number): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  async findByUid(uid: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        uid,
      },
    });
  }

  async findUserRoleAndPermission(id: number): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        id,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const uid = createUserDto.uid;
    const user = await this.userRepo.findOne({
      where: {
        uid,
      },
    });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    return await this.userRepo.save(createUserDto);
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
      relations: ['roles', 'roles.policies', 'policies'],
    });
    Object.assign(user, updateUserDto);
    return await this.userRepo.save(user);
  }

  async delete(id: number): Promise<void> {
    await this.userRepo.delete(id);
  }
}
