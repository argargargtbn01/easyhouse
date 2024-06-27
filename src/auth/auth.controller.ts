import { Controller, Post, UseGuards, Req, Get } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { FirebaseAuthGuard } from './guard/firebase-auth.guard';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req): Promise<any> {
    return req.user;
  }
  @UseGuards(FirebaseAuthGuard)
  @Get('authenticate')
  async authenticate(@Req() request: Request): Promise<any> {
    const user = request['user'];
    return this.authService.authenticate(user);
  }

  @UseGuards(FirebaseAuthGuard)
  @Post('sign-up')
  async signupFirebase(@Req() req): Promise<any> {
    console.log(req['user'])
  }
}
