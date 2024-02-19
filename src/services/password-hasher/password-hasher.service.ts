// Importing necessary modules and decorators from NestJS and other libraries
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // Used for accessing configuration settings
import { ConfigServiceType } from 'src/constants/types/environment'; // Custom type for config service
import { genSalt, hash, compare } from 'bcryptjs'; // Functions from bcryptjs for hashing and comparing passwords

// Decorator that marks a class as a provider that can be injected as a dependency
@Injectable()
export class PasswordHasherService {
  saltRounds: string; // Variable to store the number of rounds for salt generation

  // Constructor that injects the ConfigService to access application settings
  constructor(configService: ConfigService<ConfigServiceType>) {
    // Retrieves the salt rounds setting from the application's configuration
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
