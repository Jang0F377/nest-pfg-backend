import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AppSecretsConfig,
  ConfigServiceType,
} from 'src/constants/types/environment';
import { UserProfile } from 'src/types';
import { promisify } from 'util';

/* eslint-disable @typescript-eslint/no-var-requires */
const jwt = require('jsonwebtoken');
const signTokenAsync = promisify(jwt.sign);
const verifyTokenAsync = promisify(jwt.verify);

@Injectable()
export class JwtService {
  constructor(private configService: ConfigService<ConfigServiceType>) {}
  secret = this.configService.get<AppSecretsConfig>('app.secret');

  /**
   * Generates a JWT token for a user profile.
   *
   * @param {UserProfile} userProfile - The user profile data to encode in the token.
   * @returns {Promise<string>} A promise that resolves with the generated JWT token.
   */
  async generateToken(userProfile: UserProfile): Promise<string> {
    let token: string;
    try {
      token = signTokenAsync(userProfile, this.secret, {
        expiresIn: 3600 * 60,
      });
    } catch (err) {
      throw new HttpException(err, HttpStatus.EXPECTATION_FAILED);
    }
    return token;
  }

  /**
   * Validates a given JWT token and returns the decoded user profile.
   *
   * @param {string} token - The JWT token to validate.
   * @returns {Promise<UserProfile>} A promise that resolves with the decoded user profile.
   */
  async validateToken(token: string): Promise<UserProfile> {
    let userProfile: UserProfile;
    try {
      const decodedToken = await verifyTokenAsync(token, this.secret);
      userProfile = Object.assign(
        { sub: '', role: [''] },
        {
          sub: decodedToken.sub,
          role: decodedToken.role,
        },
      );
    } catch (err) {
      throw new HttpException(err, HttpStatus.EXPECTATION_FAILED);
    }
    return userProfile;
  }
}
