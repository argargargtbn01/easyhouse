import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
} from 'amazon-cognito-identity-js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from 'axios';
import SimpleCrypto from 'simple-crypto-js';
import { User } from './user.entity';
import { RegisterUserDto } from './dtos/register-user.dto';
import { VerifyUserDto } from './dtos/verify-user.dto';
import { AuthenticateUserDto } from './dtos/authenticate-user.dto';
import { RequestNewPasswordDto } from './dtos/request-new-password.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { GoogleUser } from './types/google-user.type';
import { UserResponseDto } from './types/user.type';
import { LoginTypes } from './types/login-type.enum';

@Injectable()
export class AuthService {
  private readonly userPool: CognitoUserPool;
  private readonly cognitoProvider: CognitoIdentityServiceProvider;
  private clientID: string;
  private userPoolId: string;

  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    private readonly dataSource: DataSource,
  ) {
    this.clientID = process.env.AWS_COGNITO_CLIENT_ID;
    this.userPoolId = process.env.AWS_COGNITO_USER_POOL_ID;
    this.userPool = new CognitoUserPool({
      UserPoolId: this.userPoolId,
      ClientId: this.clientID,
    });
    this.cognitoProvider = new CognitoIdentityServiceProvider({
      region: process.env.AWS_REGION,
    });
  }

  async registerUser(dto: RegisterUserDto): Promise<CognitoUser> {
    try {
      const checkUserExist = await this.userRepo.findOne({
        where: { email: dto.email },
      });
      if (checkUserExist) {
        throw new HttpException('User with this email already exists', HttpStatus.BAD_REQUEST);
      }
      const user = await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
        const cognitoUser = await this.createCognitoUser(dto.email, dto.password);

        await transactionalEntityManager.save(User, {
          ...dto,
          loginType: LoginTypes.MANUAL,
        });

        return cognitoUser;
      });
      return user;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async createCognitoUser(
    email: string,
    password: string,
    isGoogleLogin = false,
  ): Promise<CognitoUser> {
    try {
      return new Promise((resolve, reject) => {
        return this.userPool.signUp(
          email,
          password,
          [
            new CognitoUserAttribute({ Name: 'email', Value: email }),
            new CognitoUserAttribute({
              Name: 'custom:login',
              Value: isGoogleLogin ? LoginTypes.GOOGLE : LoginTypes.MANUAL,
            }),
          ],

          null,
          (err, result) => {
            if (!result) {
              reject(err);
            } else {
              resolve(result.user);
            }
          },
        );
      });
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async verifyUser(dto: VerifyUserDto): Promise<void> {
    try {
      const { email, verificationCode } = dto;
      const user = await this.userRepo.findOne({
        where: { email: email },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const params: CognitoIdentityServiceProvider.Types.ConfirmSignUpRequest = {
        ClientId: this.clientID,
        Username: email,
        ConfirmationCode: verificationCode,
      };
      await this.cognitoProvider.confirmSignUp(params).promise();
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async authenticateUser(authenticateUserDto: AuthenticateUserDto): Promise<CognitoUserSession> {
    try {
      const { email, password } = authenticateUserDto;
      const user = await this.userRepo.findOne({
        where: { email: email },
      });
      if (user.loginType === LoginTypes.GOOGLE) {
        throw new HttpException(
          'This email previously registered with google, Please login with google',
          HttpStatus.BAD_REQUEST,
        );
      }
      const authenticationDetails = new AuthenticationDetails({
        Username: email,
        Password: password,
      });
      const userData = {
        Username: email,
        Pool: this.userPool,
      };
      const newUser = new CognitoUser(userData);

      return new Promise<CognitoUserSession>((resolve, reject) => {
        newUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (error) => {
            reject(new HttpException(error.message, HttpStatus.UNAUTHORIZED));
          },
          newPasswordRequired: () => {
            reject(new HttpException('Password reset is required', HttpStatus.UNAUTHORIZED));
          },
        });
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  async getUser(session: CognitoUserSession): Promise<UserResponseDto> {
    try {
      const payload = session.getIdToken().payload;
      const email = payload.email;
      const role = payload['custom:role'];
      if (!email) {
        throw new HttpException('Email is required', HttpStatus.NOT_FOUND);
      }
      if (!role) {
        throw new HttpException('Role is required', HttpStatus.NOT_FOUND);
      }

      const user: User = await this.userRepo.findOne({
        where: { email: email },
      });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const userResponseDto: UserResponseDto = {
        email,
        role,
        id: user.id,
      };
      return userResponseDto;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 401);
    }
  }

  async refreshToken(token: string): Promise<string> {
    if (!token) {
      throw new HttpException('Token is required', HttpStatus.BAD_REQUEST);
    }
    try {
      const params = {
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        ClientId: this.clientID,
        AuthParameters: {
          REFRESH_TOKEN: token,
        },
      };
      const result = await this.cognitoProvider.initiateAuth(params).promise();
      const accessToken = result.AuthenticationResult.AccessToken;
      return accessToken;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async logout(userName: string): Promise<any> {
    try {
      const params: CognitoIdentityServiceProvider.Types.AdminUserGlobalSignOutRequest = {
        UserPoolId: this.userPoolId,
        Username: userName,
      };
      await this.cognitoProvider.adminUserGlobalSignOut(params).promise();
    } catch (error) {
      throw new HttpException(`Failed to logout: ${error.message}`, 400);
    }
  }

  async getUserByEmail(
    email: string,
  ): Promise<CognitoIdentityServiceProvider.Types.AdminGetUserResponse> {
    try {
      const params: CognitoIdentityServiceProvider.Types.AdminGetUserRequest = {
        UserPoolId: this.userPoolId,
        Username: email,
      };
      return await this.cognitoProvider.adminGetUser(params).promise();
    } catch (error) {
      throw new HttpException(`Failed to get user by email: ${error.message}`, 400);
    }
  }

  async forgotPassword(dto: RequestNewPasswordDto): Promise<void> {
    try {
      const user = await this.getUserByEmail(dto.email);
      const params: CognitoIdentityServiceProvider.Types.ForgotPasswordRequest = {
        ClientId: this.clientID,
        Username: user.Username,
      };
      await this.cognitoProvider.forgotPassword(params).promise();
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async verifyForgotPassword(dto: ForgotPasswordDto): Promise<any> {
    try {
      const user = await this.getUserByEmail(dto.email);
      const params: CognitoIdentityServiceProvider.Types.ConfirmForgotPasswordRequest = {
        ClientId: this.clientID,
        Username: user.Username,
        ConfirmationCode: dto.ConfirmationCode,
        Password: dto.newPassword,
      };
      await this.cognitoProvider.confirmForgotPassword(params).promise();
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }

  async updateUserEmail(userName: string, newEmail: string, exisingEmail: string): Promise<void> {
    try {
      const currentUser = await this.userRepo.findOne({
        where: { email: exisingEmail },
      });
      if (!currentUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const params: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesRequest = {
        UserPoolId: this.userPoolId,
        Username: userName,
        UserAttributes: [
          {
            Name: 'email',
            Value: newEmail,
          },
        ],
      };
      await this.cognitoProvider.adminUpdateUserAttributes(params).promise();
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async verifyEmailVerificationCode(
    userName: string,
    oldEmail: string,
    verificationCode: string,
    token: string,
  ): Promise<void> {
    try {
      // Find Existing user From Pool
      const existingUser: CognitoIdentityServiceProvider.Types.AdminGetUserResponse =
        await this.cognitoProvider
          .adminGetUser({ Username: userName, UserPoolId: this.userPoolId })
          .promise();
      const exisingEmail = existingUser.UserAttributes.filter(
        (attr) => attr.Name === 'custom:email',
      ).shift().Value;
      //Update Param
      const params: CognitoIdentityServiceProvider.Types.VerifyUserAttributeRequest = {
        AccessToken: token,
        AttributeName: 'email',
        Code: verificationCode,
      };
      await this.cognitoProvider.verifyUserAttribute(params).promise();
      // Update Token Attribute
      const customParams: CognitoIdentityServiceProvider.Types.AdminUpdateUserAttributesRequest = {
        UserPoolId: this.userPoolId,
        Username: userName,
        UserAttributes: [
          {
            Name: 'custom:email',
            Value: exisingEmail,
          },
        ],
      };
      await this.cognitoProvider.adminUpdateUserAttributes(customParams).promise();
      //Update database
      await this.userRepo.update({ email: oldEmail }, { email: exisingEmail });
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }
  generatePassword(): string {
    const passOne = (Math.random() + 1).toString(36).substring(2, 8);
    const passTwo = (Math.random() + 1).toString(36).substring(2, 8);
    const upperPassOne = passOne.charAt(0).toUpperCase() + passOne.slice(1);
    const specialPassTwo = passTwo + '_' + (Math.random() + 1).toString(36).substring(2, 8);
    return `${upperPassOne}-${specialPassTwo}`;
  }

  async googleLogin(googleUser: GoogleUser): Promise<CognitoUserSession> {
    try {
      const simpleCrypto = new SimpleCrypto(process.env.SECRET);
      const { _accessToken, email } = googleUser;

      let password: string;

      if (await this.isTokenExpired(_accessToken)) {
        throw new HttpException('Token is expired', HttpStatus.UNAUTHORIZED);
      }

      const user = await this.userRepo.findOne({
        where: { email: email },
      });

      if (user && user.loginType === LoginTypes.MANUAL) {
        throw new HttpException(
          'This email previously registered with email and password, Please login with your password',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!user) {
        password = this.generatePassword();
        const encryptedPassword = simpleCrypto.encrypt(password);

        await this.dataSource.manager.transaction(async (transactionalEntityManager) => {
          const cognitoUser = await this.createCognitoUser(email, password, true);

          await transactionalEntityManager.save(User, {
            email,
            firstName: googleUser.name.givenName,
            lastName: googleUser.name.familyName,
            loginType: LoginTypes.GOOGLE,
            password: encryptedPassword,
          });
          return cognitoUser;
        });
      } else {
        password = simpleCrypto.decrypt(user.password).toString();
      }

      const session = await this.UserSignIn(email, password);
      return session;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }

      return false;
    } catch (error) {
      return true;
    }
  }

  async UserSignIn(username: string, password: string): Promise<CognitoUserSession> {
    try {
      const authenticationDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      const userData = {
        Username: username,
        Pool: this.userPool,
      };

      const newUser = new CognitoUser(userData);

      const session = await new Promise<CognitoUserSession>((resolve, reject) => {
        newUser.authenticateUser(authenticationDetails, {
          onSuccess: (result) => {
            resolve(result);
          },
          onFailure: (error) => {
            reject(new HttpException(error.message, HttpStatus.UNAUTHORIZED));
          },
          newPasswordRequired: () => {
            reject(new HttpException('Password reset is required', HttpStatus.UNAUTHORIZED));
          },
        });
      });
      return session;
    } catch (error) {
      throw new HttpException(error.message, error?.status ?? 400);
    }
  }
}
