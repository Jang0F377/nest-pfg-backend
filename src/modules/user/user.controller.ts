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
import { Credentials, RegistrationObject } from 'src/types';
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: "'Returns the currently logged in user's info.",
  })
  returnCurrentUser(@Headers('token') token: string): Promise<UserDto> {
    return this.userService.returnCurrentUser(token);
  }

  @Public()
  @Get('all')
  @ApiResponse({
    status: 200,
    schema: {
      type: 'array',
      items: {
        $ref: getSchemaPath(UserDto),
      },
    },
    description: 'Returns array of all users',
  })
  returnAllUsers(): Promise<UserDto[]> {
    return this.userService.returnAllUsers();
  }

  @Public()
  @Get(':id')
  @ApiResponse({
    status: 200,
    type: UserDto,
    description: 'Return a specific user by Id',
  })
  returnSpecificUser(@Param('id') id: string): Promise<UserDto> {
    return this.userService.returnSpecificUser(id);
  }

  @Role(ROLES.USER, ROLES.ADMIN, ROLES.SUPER_ADMIN)
  @Get('validate-recipient/:email')
  @ApiExcludeEndpoint()
  validateSeshRecipient(
    @Param('email') email: string,
  ): Promise<string | boolean> {
    return this.userService.validateSeshRecipient(email);
  }

  @Public()
  @Post('register')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
          format: 'password',
        },
        favoriteGames: {
          type: 'array',
          items: {
            type: 'string',
          },
          maxItems: 3,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: UserDto,
    description: 'Register a new user by email',
  })
  registerNewUser(
    @Body() registrationObject: RegistrationObject,
  ): Promise<UserDto> {
    return this.userService.registerNewUser(registrationObject);
  }

  @Public()
  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          format: 'email',
        },
        password: {
          type: 'string',
          format: 'password',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    type: String,
    description: 'Login a registered user. Returns JWT token',
  })
  loginUser(@Body() credentials: Credentials): Promise<string> {
    return this.userService.loginUser(credentials);
  }

  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @Patch('me/favorites')
  @ApiExcludeEndpoint()
  updateFavoriteGames(
    @Headers('token') token: string,
    @Body() favoriteGames: PartialUserDto,
  ): Promise<UserDto> {
    return;
  }

  @Role(ROLES.SUPER_ADMIN)
  @Delete('all')
  @ApiExcludeEndpoint()
  resetUserDb(): Promise<Record<string, any>> {
    return this.userService.resetUserDb();
  }
}
