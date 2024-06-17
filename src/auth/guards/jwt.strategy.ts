import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { passportJwtSecret } from 'jwks-rsa';
import { Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Request } from 'express';
import { UserPayload } from '../types/user-payload.type';

export const cookieExtractor = function (req: Request): string {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

export const cookieExtractorRefresh = function (req: Request): string {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['refresh_token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    const cognitoAuthority = `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_USER_POOL_ID}`;
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 10,
        jwksUri: `${cognitoAuthority}/.well-known/jwks.json`,
      }),
      jwtFromRequest: cookieExtractor,
      issuer: `${cognitoAuthority}`,
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload): Promise<UserPayload> {
    const cognitoUser = await this.authService.getUserByEmail(payload.username);
    const role = cognitoUser.UserAttributes.find((attr) => attr.Name === 'custom:role');
    const user: UserPayload = {
      token_use: payload.token_use,
      username: payload.username,
      role: role.Value || 'user',
      client_id: payload.client_id,
    };
    return user;
  }
}
