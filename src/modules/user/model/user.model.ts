import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ROLES } from 'src/constants/user';
import { Sesh, SeshSchema } from 'src/modules/sesh/model/sesh.model';

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    index: true,
  })
  email: string;

  @Prop()
  firstName?: string;

  @Prop()
  lastName?: string;

  @Prop()
  image?: string;

  @Prop({
    type: Array,
    default: [],
  })
  favoriteGames?: Array<string>;

  @Prop({
    default: [],
    ref: 'Sesh',
  })
  recentSeshes?: mongoose.Schema.Types.ObjectId[];

  @Prop({
    required: false,
    default: [],
    ref: 'Sesh',
  })
  upcomingUndecidedSeshes?: mongoose.Schema.Types.ObjectId[];

  @Prop({
    required: false,
    default: [],
    ref: 'Sesh',
  })
  upcomingAcceptedSeshes?: mongoose.Schema.Types.ObjectId[];

  @Prop({
    required: false,
    default: [],
    ref: 'Sesh',
  })
  upcomingDeclinedSeshes?: mongoose.Schema.Types.ObjectId[];

  @Prop({
    default: false,
  })
  supporter?: boolean;

  @Prop(ROLES)
  role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
