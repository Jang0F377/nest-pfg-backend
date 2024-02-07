import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceType } from 'src/constants/types/environment';
import { genSalt, hash } from 'bcryptjs';
import { compare } from 'bcryptjs';

@Injectable()
export class PasswordHasherService {
  saltRounds: string;
  constructor(configService: ConfigService<ConfigServiceType>) {
    this.saltRounds = configService.get('app.saltRounds');
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(+this.saltRounds);
    return hash(password, salt);
  }

  async comparePasswords(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    const passwordsMatch = await compare(providedPassword, storedPassword);
    return passwordsMatch;
  }
}
