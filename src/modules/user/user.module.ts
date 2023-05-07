import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './model/user.model';
import {
  UserWithPassword,
  UserWithPasswordSchema,
} from './model/user-with-password.model';
import { JwtService } from 'src/services/jwt/jwt.service';
import { PasswordHasherService } from 'src/services/password-hasher/password-hasher.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserWithPassword.name,
        schema: UserWithPasswordSchema,
      },
    ]),
  ],
  providers: [UserService, JwtService, PasswordHasherService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
