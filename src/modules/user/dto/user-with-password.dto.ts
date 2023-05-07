import { IsNotEmpty } from 'class-validator';
import { UserDto } from './user.dto';

export class UserWithPasswordDto extends UserDto {
  @IsNotEmpty({
    message: 'Password cannot be empty',
  })
  password: string;
}
