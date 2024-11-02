import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create.user.dto';
import { FirebaseAuthGuard } from 'src/auth/guard/firebase-auth.guard';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserDecorator } from './decorators/user.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  @UseGuards(FirebaseAuthGuard)
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':uid')
  @UseGuards(FirebaseAuthGuard)
  async findById(@Req() request: Request, @Param('uid') uid: string): Promise<User> {
    const user = await this.userService.findByUid(uid);
    return user;
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.userService.delete(id);
  }
}
