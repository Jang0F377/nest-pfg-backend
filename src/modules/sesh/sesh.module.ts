import { Module } from '@nestjs/common';
import { SeshService } from './sesh.service';
import { SeshController } from './sesh.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sesh, SeshSchema } from './model/sesh.model';
import {
  UserWithPassword,
  UserWithPasswordSchema,
} from '../user/model/user-with-password.model';
import { User, UserSchema } from '../user/model/user.model';
import { UserService } from '../user/user.service';
import { JwtService } from 'src/services/jwt/jwt.service';
import { PasswordHasherService } from 'src/services/password-hasher/password-hasher.service';
import { UserModule } from '../user/user.module';
import { SeshRepository } from './repositories/sesh.repository';

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
    UserModule,
  ],
  providers: [
    SeshService,
    SeshRepository,
    UserService,
    JwtService,
    PasswordHasherService,
  ],
  controllers: [SeshController],
})
export class SeshModule {}
