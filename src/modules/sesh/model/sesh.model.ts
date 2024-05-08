import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { SESH_STATUS } from 'src/constants/user';
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
  recipients: mongoose.Types.ObjectId[];

  @Prop({ ref: 'User' })
  sentFrom: mongoose.Types.ObjectId;

  @Prop({ required: false, default: new Date().toISOString() })
  _createdAt?: string;

  @Prop({ required: false })
  _updatedAt?: string;

  @Prop({
    required: false,
    ref: 'User',
  })
  usersConfirmed?: mongoose.Types.ObjectId[];

  @Prop({ required: false, ref: 'User' })
  usersDeclined?: mongoose.Types.ObjectId[];

  @Prop({ required: false, ref: 'User' })
  usersUnconfirmed?: mongoose.Types.ObjectId[];

  @Prop({ required: false, default: SESH_STATUS.NOT_STARTED })
  status?: SESH_STATUS;
}

export const SeshSchema = SchemaFactory.createForClass(Sesh);
