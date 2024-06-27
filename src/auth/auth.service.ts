import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) {}

  async login(user: any): Promise<any> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async authenticate(user: any): Promise<any> {
    try {
      return user;
    } catch (error) {
      throw error;
    }
  }

  async signup(user: User): Promise<User> {
    try {
      return this.userService.create(user);
    } catch (error) {
      throw error;
    }
  }
}
