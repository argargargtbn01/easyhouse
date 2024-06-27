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
  async findById(uid: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        uid,
      },
    });
  }

  async findUserRoleAndPermission(uid: string): Promise<User> {
    return await this.userRepo.findOne({
      where: {
        uid,
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

  async update(uid: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepo.findOne({
      where: {
        uid,
      },
      relations: ['roles', 'roles.policies', 'policies'],
    });

    return await this.userRepo.save(user);
  }

  async delete(uid: string): Promise<void> {
    await this.userRepo.delete(uid);
  }
}
