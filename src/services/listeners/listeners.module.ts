import { Module } from '@nestjs/common';
import { ListenersService } from './listeners.service';
import { UserService } from 'src/modules/user/user.service';
import { SeshRepository } from 'src/modules/sesh/repositories/sesh.repository';
import { SeshService } from 'src/modules/sesh/sesh.service';
import { JwtService } from '../jwt/jwt.service';
import { PasswordHasherService } from '../password-hasher/password-hasher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Sesh, SeshSchema } from 'src/modules/sesh/model/sesh.model';
import {
  UserWithPassword,
  UserWithPasswordSchema,
} from 'src/modules/user/model/user-with-password.model';
import { User, UserSchema } from 'src/modules/user/model/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Sesh.name,
        schema: SeshSchema,
      },
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
  providers: [
    ListenersService,
    SeshService,
    SeshRepository,
    UserService,
    JwtService,
    PasswordHasherService,
  ],
})
export class ListenersModule {}
