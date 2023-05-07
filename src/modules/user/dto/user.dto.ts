import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { ROLES } from 'src/constants/user';
import { SeshDto } from 'src/modules/sesh/dto/sesh.dto';

export class UserDto {
  _id?: any;

  @IsEmail({}, { message: 'Email must be a valid email format.' })
  email: string;

  @IsOptional()
  firstName?: string;

  @IsOptional()
  lastName?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  @IsArray()
  favoriteGames?: Array<string>;

  @IsOptional()
  @IsArray()
  recentSeshes?: Array<SeshDto>;

  @IsOptional()
  upcomingUndecidedSeshes?: Array<SeshDto>;

  @IsOptional()
  upcomingAcceptedSeshes?: Array<SeshDto>;

  @IsOptional()
  upcomingDeclinedSeshes?: Array<SeshDto>;

  @IsOptional()
  @IsBoolean()
  supporter?: boolean;

  @IsEnum(ROLES)
  role: ROLES;
}

export class PartialUserDto extends PartialType(UserDto) {}
