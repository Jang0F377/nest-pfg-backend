import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('healthcheck')
export class HealthcheckController {
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  public healthcheck(): Record<string, any> {
    return {
      currentTime: new Date().toISOString(),
      healthy: true,
    };
  }
}
