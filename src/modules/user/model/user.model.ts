import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ROLES } from 'src/constants/user';
import { Sesh } from 'src/modules/sesh/model/sesh.model';

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
    type: Array,
    default: [],
  })
  recentSeshes?: Array<Sesh>;

  @Prop({
    required: false,
    default: [],
  })
  upcomingUndecidedSeshes?: Array<Sesh>;

  @Prop({
    required: false,
    default: [],
  })
  upcomingAcceptedSeshes?: Array<Sesh>;

  @Prop({
    required: false,
    default: [],
  })
  upcomingDeclinedSeshes?: Array<Sesh>;

  @Prop({
    default: false,
  })
  supporter?: boolean;

  @Prop(ROLES)
  role: ROLES;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });
