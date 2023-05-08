import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/modules/user/model/user.model';

@Schema()
export class Sesh extends Document {
  @Prop({
    required: true,
    type: String,
  })
  game: string;

  @Prop({
    required: true,
  })
  proposedDay: string;

  @Prop({ required: true })
  proposedTime: string;

  @Prop({ required: true, type: Array })
  recipients: Array<string>;

  @Prop()
  sentFrom: string;

  @Prop({ required: false, default: Date.now() })
  _createdAt?: number;

  @Prop({ required: false })
  _updatedAt?: number;

  @Prop({ required: false })
  usersConfirmed?: Array<User>;

  @Prop({ required: false })
  usersDeclined?: Array<User>;

  @Prop({ required: false })
  usersUnconfirmed?: Array<User>;
}

export const SeshSchema = SchemaFactory.createForClass(Sesh);
