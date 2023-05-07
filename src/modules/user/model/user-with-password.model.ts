import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { User } from './user.model';

@Schema()
export class UserWithPassword extends User {
  @Prop({
    required: true,
  })
  password: string;
}

export const UserWithPasswordSchema =
  SchemaFactory.createForClass(UserWithPassword);
