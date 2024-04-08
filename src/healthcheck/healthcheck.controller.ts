import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';

@ApiTags('Healthcheck')
@Controller('healthcheck')
export class HealthcheckController {
  @Public()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: 'Healthcheck to verify service is healthy.',
    schema: {
      type: 'object',
      properties: {
        currentTime: {
          type: 'string',
          format: 'date-time',
        },
        healthy: {
          type: 'boolean',
        },
      },
    },
  })
  public healthcheck(): HealthcheckResponse {
    return {
      currentTime: new Date().toISOString(),
      healthy: true,
    };
  }
}

interface HealthcheckResponse {
  currentTime: string;
  healthy: boolean;
}
