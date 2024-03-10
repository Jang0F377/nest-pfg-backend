import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import mongoose from 'mongoose';
import { ROLES } from 'src/constants/user';
import { SeshDto } from 'src/modules/sesh/dto/sesh.dto';

export class UserDto {
  _id?: mongoose.Types.ObjectId;

  @IsEmail({}, { message: 'Email must be a valid email format.' })
  email: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  image?: string;

  @IsArray()
  favoriteGames: Array<string>;

  @IsOptional()
  @IsArray()
  recentSeshes?: mongoose.Types.ObjectId[];

  @IsOptional()
  upcomingUndecidedSeshes?: mongoose.Types.ObjectId[];

  @IsOptional()
  upcomingAcceptedSeshes?: mongoose.Types.ObjectId[];

  @IsOptional()
  upcomingDeclinedSeshes?: mongoose.Types.ObjectId[];

  @IsOptional()
  @IsBoolean()
  supporter?: boolean;

  @IsEnum(ROLES)
  role: ROLES;
}

export class PartialUserDto extends PartialType(UserDto) {}
