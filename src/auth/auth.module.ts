import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './guards/google.strategy';
import { CongnitoAuthGuard } from './guards/cognito-auth.guard';
import { UsersModule } from 'src/users/user.module';
import { JwtStrategy } from './guards/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, CongnitoAuthGuard],
  exports: [AuthService, CongnitoAuthGuard],
})
export class AuthModule {}
