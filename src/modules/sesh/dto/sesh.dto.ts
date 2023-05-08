import { PartialType } from '@nestjs/mapped-types';
import { IsArray, IsNotEmpty, IsOptional, IsString } from 'class-validator';
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
  recipients: Array<string>;

  @IsOptional()
  @IsNotEmpty({ message: 'sentFrom cannot be empty' })
  sentFrom: string;

  _createdAt?: number;

  _updatedAt?: number;

  usersConfirmed?: Array<UserDto>;

  usersDeclined?: Array<UserDto>;

  usersUnconfirmed?: Array<UserDto>;
}

export class PartialSeshDto extends PartialType(SeshDto) {}
