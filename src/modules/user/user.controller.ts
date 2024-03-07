import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Role } from 'src/common/decorators/role.decorator';
import { ROLES } from 'src/constants/user';
import { PartialUserDto, UserDto } from './dto/user.dto';
import { UserService } from './user.service';
import { Public } from 'src/common/decorators/public.decorator';
import { Credentials } from 'src/types';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  returnCurrentUser(@Headers('token') token: string): Promise<UserDto> {
    return this.userService.returnCurrentUser(token);
  }

  @Public()
  @Get('all')
  returnAllUsers(): Promise<UserDto[]> {
    return this.userService.returnAllUsers();
  }

  @Public()
  @Get(':id')
  returnSpecificUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.returnSpecificUser(id);
  }

  @Role(ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Get('validate-recipient/:email')
  validateSeshRecipient(@Param('email') email: string): Promise<boolean> {
    return this.userService.validateSeshRecipient(email);
  }

  @Public()
  @Post('register')
  registerNewUser(@Body() credentials: Credentials): Promise<UserDto> {
    return this.userService.registerNewUser(credentials);
  }

  @Public()
  @Post('login')
  loginUser(@Body() credentials: Credentials): Promise<string> {
    return this.userService.loginUser(credentials);
  }

  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @Patch('me/favorites')
  updateFavoriteGames(
    @Headers('token') token: string,
    @Body() favoriteGames: PartialUserDto,
  ): Promise<UserDto> {
    return this.userService.updateFavoriteGames(token, favoriteGames);
  }

  @Role(ROLES.SUPER_ADMIN)
  @Delete('all')
  resetUserDb(): Promise<Record<string, any>> {
    return this.userService.resetUserDb();
  }
}
