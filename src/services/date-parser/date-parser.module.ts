import { Global, Module } from '@nestjs/common';
import { DateParserService } from './date-parser.service';

@Global()
@Module({
  providers: [DateParserService],
})
export class DateParserModule {}
