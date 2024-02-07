import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { SeshService } from './sesh.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SeshDto } from './dto/sesh.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { ROLES } from 'src/constants/user';

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
  createNewSesh(
    @Headers('token') token: string,
    @Body() sesh: SeshDto,
  ): Promise<SeshDto> {
    return this.seshService.createNewSesh(token, sesh);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/accept')
  @Role(ROLES.USER, ROLES.SUPER_ADMIN)
  rsvpForSesh(
    @Headers('token') token: string,
    @Param('id') seshId: string,
  ): Promise<any> {
    return this.seshService.rsvpForSesh(token, seshId);
  }
}
