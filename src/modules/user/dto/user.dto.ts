import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
} from 'class-validator';
import mongoose from 'mongoose';
import { ROLES } from 'src/constants/user';

export class UserDto {
  @ApiProperty({
    type: String,
    format: 'uuid',
    example: '65d39ec687e5cf09e433389f',
  })
  _id?: mongoose.Types.ObjectId;

  @ApiProperty({
    type: String,
    format: 'email',
    example: 'frasiercrane@kacl780.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email format.' })
  email: string;

  @ApiProperty({
    type: String,
    example: 'Frasier',
  })
  @IsOptional()
  firstName?: string;

  @ApiProperty({
    type: String,
    example: 'Crane',
  })
  @IsOptional()
  lastName?: string;

  @ApiProperty({
    type: String,
    example: 'TODO',
  })
  @IsOptional()
  image?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
    },
    maxItems: 3,
  })
  @IsArray()
  favoriteGames: Array<string>;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
    example: ['6614416e0d6e0caee8968307', '65d39ec687e5cf09e433389f'],
  })
  @IsOptional()
  @IsArray()
  recentSeshes?: mongoose.Types.ObjectId[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
    example: ['6614416e0d6e0caee8968307', '65d39ec687e5cf09e433389f'],
  })
  @IsOptional()
  upcomingUndecidedSeshes?: mongoose.Types.ObjectId[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
    example: ['66146a564baa732bdee6fb57', '65f093c8052a6f45c220a85b'],
  })
  @IsOptional()
  upcomingAcceptedSeshes?: mongoose.Types.ObjectId[];

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'uuid',
    },
    example: ['64146a564baa732bdee6fb57', '64f093c8052a6f45c220a85b'],
  })
  @IsOptional()
  upcomingDeclinedSeshes?: mongoose.Types.ObjectId[];

  @ApiProperty({
    type: Boolean,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  supporter?: boolean;

  @IsEnum(ROLES)
  role: ROLES;
}

export class PartialUserDto extends PartialType(UserDto) {}
