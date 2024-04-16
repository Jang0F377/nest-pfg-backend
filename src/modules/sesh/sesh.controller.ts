import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { SeshService } from './sesh.service';
import { Public } from 'src/common/decorators/public.decorator';
import { PartialSeshDto, SeshDto } from './dto/sesh.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { ROLES } from 'src/constants/user';
import { ApiExcludeEndpoint, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Sesh')
@Controller('sesh')
export class SeshController {
  constructor(private seshService: SeshService) {}

  @Get(':id')
  @Public()
  @ApiResponse({
    status: 200,
    type: SeshDto,
    description: 'Get Sesh details by the Sesh Id',
  })
  getSesh(@Param('id') id: string): Promise<SeshDto> {
    return this.seshService.getSesh(id);
  }

  @Post('create')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: 'object',
    schema: {
      properties: {
        _id: {
          type: 'string',
          format: 'uuid',
        },
        game: {
          type: 'string',
        },
        proposedDay: {
          type: 'string',
        },
        proposedTime: {
          type: 'string',
        },
        recipients: {
          type: 'array',
          items: {
            type: 'string',
            format: 'uuid',
          },
        },
        sentFrom: {
          type: 'string',
          format: 'uuid',
        },
        _createdAt: {
          type: 'string',
          format: 'date-time',
        },
        _updatedAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    description: 'The Sesh has been successfully created.',
  })
  createNewSesh(
    @Headers('token') token: string,
    @Body() sesh: SeshDto,
  ): Promise<SeshDto> {
    return this.seshService.createNewSesh(token, sesh);
  }

  @Post(':id/accept')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: SeshDto,
    description: 'Successfully accepted the Sesh Invite.',
  })
  rsvpForSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
  ): Promise<SeshDto> {
    return this.seshService.rsvpForSesh(token, seshId);
  }

  @Post(':id/decline')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: SeshDto,
    description: 'Successfully declined the Sesh Invite.',
  })
  declineRsvpForSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
  ): Promise<SeshDto> {
    return this.seshService.declineRsvpForSesh(token, seshId);
  }

  @Patch(':id')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @ApiExcludeEndpoint()
  updateSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
    @Body() updatedSesh: PartialSeshDto,
  ): Promise<SeshDto> {
    return this.seshService.updateSesh(token, seshId, updatedSesh);
  }
}
