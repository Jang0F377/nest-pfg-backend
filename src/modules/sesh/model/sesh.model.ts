import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User, UserSchema } from 'src/modules/user/model/user.model';

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

  @Prop({ required: true, ref: 'User' })
  recipients: mongoose.Schema.Types.ObjectId[];

  @Prop({ ref: 'User' })
  sentFrom: mongoose.Schema.Types.ObjectId;

  @Prop({ required: false, default: Date.now() })
  _createdAt?: number;

  @Prop({ required: false })
  _updatedAt?: string;

  @Prop({
    required: false,
    ref: 'User',
  })
  usersConfirmed?: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: false, ref: 'User' })
  usersDeclined?: mongoose.Schema.Types.ObjectId[];

  @Prop({ required: false, ref: 'User' })
  usersUnconfirmed?: mongoose.Schema.Types.ObjectId[];
}

export const SeshSchema = SchemaFactory.createForClass(Sesh);
