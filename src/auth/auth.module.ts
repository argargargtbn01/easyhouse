import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './guards/google.strategy';
import { JwtStrategy } from './jwt.strategy';
import { CongnitoAuthGuard } from './guards/cognito-auth.guard';
import { User } from './user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, CongnitoAuthGuard],
  exports: [AuthService, CongnitoAuthGuard],
})
export class AuthModule {}
