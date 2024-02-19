// Importing necessary modules and decorators from NestJS and other libraries
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceType } from 'src/constants/types/environment';
import { genSalt, hash, compare } from 'bcryptjs';
@Injectable()
export class PasswordHasherService {
  saltRounds: string;
  constructor(configService: ConfigService<ConfigServiceType>) {
    this.saltRounds = configService.get('app.saltRounds');
  }

  /**
   * Hashes a plaintext password using bcryptjs.
   *
   * @param {string} password The plaintext password to hash.
   * @returns {Promise<string>} A promise that resolves with the hashed password.
   */
  async hashPassword(password: string): Promise<string> {
    // Generates a salt using the configured number of rounds
    const salt = await genSalt(+this.saltRounds);
    // Returns the hash of the password using the generated salt
    return hash(password, salt);
  }

  /**
   * Compares a provided password with a stored hashed password.
   *
   * @param {string} providedPassword The plaintext password provided by the user.
   * @param {string} storedPassword The hashed password stored in the database.
   * @returns {Promise<boolean>} A promise that resolves with a boolean indicating if the passwords match.
   */
  async comparePasswords(
    providedPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    // Compares the provided password with the stored hashed password
    const passwordsMatch = await compare(providedPassword, storedPassword);
    // Returns true if the passwords match, false otherwise
    return passwordsMatch;
  }
}
