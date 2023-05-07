import { Body, Controller, Headers, Post } from '@nestjs/common';
import { SeshService } from './sesh.service';
import { Public } from 'src/common/decorators/public.decorator';
import { SeshDto } from './dto/sesh.dto';
import { Role } from 'src/common/decorators/role.decorator';
import { ROLES } from 'src/constants/user';

@Controller('sesh')
export class SeshController {
  constructor(private seshService: SeshService) {}

  @Post('create')
  @Role(ROLES.USER, ROLES.ADMIN)
  createNewSesh(
    @Headers('token') token: string,
    @Body() sesh: SeshDto,
  ): Promise<SeshDto> {
    return this.seshService.createNewSesh(token, sesh);
  }
}
