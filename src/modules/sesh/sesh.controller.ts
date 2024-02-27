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
import { ApiResponse } from '@nestjs/swagger';

@Controller('sesh')
export class SeshController {
  constructor(private seshService: SeshService) {}

  @Get(':id')
  @Public()
  getSesh(@Param('id') id: string): Promise<SeshDto> {
    return this.seshService.getSesh(id);
  }

  @Post('create')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  @ApiResponse({
    status: 201,
    type: SeshDto,
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
  rsvpForSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
  ): Promise<SeshDto> {
    return this.seshService.rsvpForSesh(token, seshId);
  }

  @Post(':id/decline')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  declineRsvpForSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
  ): Promise<SeshDto> {
    return this.seshService.declineRsvpForSesh(token, seshId);
  }

  @Patch(':id')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  updateSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
    @Body() updatedSesh: PartialSeshDto,
  ): Promise<SeshDto> {
    return this.seshService.updateSesh(token, seshId, updatedSesh);
  }
}
