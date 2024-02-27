import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { UserDto } from 'src/modules/user/dto/user.dto';

export class SeshDto {
  @ApiProperty({
    type: mongoose.Types.ObjectId,
    example: '65d39ec687e5cf09e433389f',
  })
  _id?: mongoose.Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'HellDivers 2',
  })
  @IsString({ message: 'game name cannot be empty' })
  game: string;

  @ApiProperty({ type: String, example: 'tomorrow' })
  @IsNotEmpty({ message: 'proposedDay cannot be empty' })
  proposedDay: string;

  @ApiProperty({ type: String, example: '8:00pm' })
  @IsNotEmpty({ message: 'proposedTime cannot be empty' })
  proposedTime: string;

  @ApiProperty({
    type: [mongoose.Types.ObjectId],
    example: ['65d22cefa9d61389b181a5a9', '65d22c58a9d61389b181a59c'],
  })
  @IsNotEmpty({ message: 'recipients cannot be empty' })
  recipients: mongoose.Types.ObjectId[];

  @ApiProperty({
    type: mongoose.Types.ObjectId,
    example: '65d3936d9678cb7561c4d57e',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'sentFrom cannot be empty' })
  sentFrom: mongoose.Types.ObjectId;

  @ApiProperty()
  _createdAt?: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2024-02-19T18:35:42.406Z',
  })
  _updatedAt?: string;

  @ApiProperty()
  usersConfirmed?: mongoose.Types.ObjectId[];

  @ApiProperty()
  usersDeclined?: mongoose.Types.ObjectId[];

  @ApiProperty()
  usersUnconfirmed?: mongoose.Types.ObjectId[];
}

export class PartialSeshDto extends PartialType(SeshDto) {}
