import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AwsCognitoService } from './aws-cognito.service';
import { AuthLoginUserDto } from './dtos/auth-login-user.dto';
import { AuthRegisterUserDto } from './dtos/auth-register-user.dto';
import { AuthChangePasswordUserDto } from './dtos/auth-change-password-user.dto';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AuthForgotPasswordUserDto } from './dtos/auth-forgot-password-user.dto';
import { AuthConfirmPasswordUserDto } from './dtos/auth-confirm-password-user.dto';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private awsCognitoService: AwsCognitoService) {}

  @Post('/register')
  async register(@Body() authRegisterUserDto: AuthRegisterUserDto): Promise<CognitoUser> {
    return this.awsCognitoService.registerUser(authRegisterUserDto);
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(
    @Body() authLoginUserDto: AuthLoginUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.awsCognitoService.authenticateUser(authLoginUserDto);
  }

  @Post('/change-password')
  @UsePipes(ValidationPipe)
  async changePassword(
    @Body() authChangePasswordUserDto: AuthChangePasswordUserDto,
  ): Promise<string> {
    return this.awsCognitoService.changeUserPassword(authChangePasswordUserDto);
  }

  @Post('/forgot-password')
  @UsePipes(ValidationPipe)
  async forgotPassword(@Body() authForgotPasswordUserDto: AuthForgotPasswordUserDto): Promise<any> {
    return await this.awsCognitoService.forgotUserPassword(authForgotPasswordUserDto);
  }

  @Post('/confirm-password')
  @UsePipes(ValidationPipe)
  async confirmPassword(
    @Body() authConfirmPasswordUserDto: AuthConfirmPasswordUserDto,
  ): Promise<{ status: string }> {
    return await this.awsCognitoService.confirmUserPassword(authConfirmPasswordUserDto);
  }
}
