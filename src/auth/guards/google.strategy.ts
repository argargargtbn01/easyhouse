import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';

export interface GoogleUser {
  provider: string;
  providerId: string;
  email: string;
  name: {
    givenName: string;
    familyName: string;
  };
  _accessToken: string;
  _refreshToken: string;
  picture: string;
}

export interface UserPayload {
  token_use: string;
  role: string;
  client_id: string;
  username: string;
}

export interface User {
  email: string;
  role: string;
  id: number;
}
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email', 'openid'],
      Proxy: true,
    });
  }

  authorizationParams(): { [key: string]: string } {
    return {
      access_type: 'offline',
      prompt: 'consent',
    };
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;

    const user: GoogleUser = {
      provider: 'google',
      providerId: id,
      email: emails[0].value,
      name,
      _accessToken,
      _refreshToken,
      picture: photos[0].value,
    };

    done(null, user);
  }
}
