import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class SeshDto {
  _id?: any;

  @IsString({ message: 'game name cannot be empty' })
  game: string;

  @IsNotEmpty({ message: 'proposedDay cannot be empty' })
  proposedDay: string;

  @IsNotEmpty({ message: 'proposedTime cannot be empty' })
  proposedTime: string;

  @IsNotEmpty({ message: 'recipients cannot be empty' })
  recipients: mongoose.Schema.Types.ObjectId[];

  @IsOptional()
  @IsNotEmpty({ message: 'sentFrom cannot be empty' })
  sentFrom: mongoose.Schema.Types.ObjectId;

  _createdAt?: number;

  _updatedAt?: string;

  usersConfirmed?: mongoose.Schema.Types.ObjectId[];

  usersDeclined?: mongoose.Schema.Types.ObjectId[];

  usersUnconfirmed?: mongoose.Schema.Types.ObjectId[];
}

export class PartialSeshDto extends PartialType(SeshDto) {}
