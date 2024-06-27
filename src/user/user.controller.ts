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
    const user = await this.userService.findById(uid);
    return user;
  }

  @Get('test/:uid')
  @UseGuards(FirebaseAuthGuard)
  async findByTestId(@Req() request: Request, @Param('uid') uid: string): Promise<User> {
    const user = await this.userService.findUserRoleAndPermission(uid);
    return user;
  }

  @Post()
  @UseGuards(FirebaseAuthGuard)
  async create(@Body() createUserDto: CreateUserDto): Promise<any> {
    return this.userService.create(createUserDto);
  }

  @Put(':uid')
  @UseGuards(FirebaseAuthGuard)
  async update(@Param('uid') uid: string, @Body() updateUserDto: UpdateUserDto): Promise<any> {
    return this.userService.update(uid, updateUserDto);
  }

  @Delete(':uid')
  async delete(@Param('uid') uid: string): Promise<void> {
    return this.userService.delete(uid);
  }
}
