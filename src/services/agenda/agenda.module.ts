import { Module } from '@nestjs/common';
import { agendaProvider } from 'src/utils/agenda/agenda.provider';
import { AgendaService } from './agenda.service';
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
        name: User.name,
        schema: UserSchema,
      },
      {
        name: UserWithPassword.name,
        schema: UserWithPasswordSchema,
      },
      {
        name: Sesh.name,
        schema: SeshSchema,
      },
    ]),
  ],
  providers: [agendaProvider, AgendaService],
})
export class AgendaModule {}
