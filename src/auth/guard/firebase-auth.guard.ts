import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as admin from 'firebase-admin';
import { UserService } from 'src/user/user.service';
@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private userService: UserService) {}
  extractTokenFromHeader(request: Request): string {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    if (type !== 'Bearer') {
      throw new UnauthorizedException('Invalid ID token');
    }
    return token;
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const idToken: string = this.extractTokenFromHeader(request);

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log(decodedToken);
    if (!decodedToken) {
      throw new UnauthorizedException('Invalid ID token');
    }
    const user = await this.userService.findByUid(decodedToken.uid);
    if (!user) {
      const newUser = await this.userService.create({
        uid: decodedToken.uid,
        email: decodedToken.email,
      }); // create user if not exist
      request['user'] = newUser;
    } else {
      request['user'] = user;
    }
    return true;
  }
}
