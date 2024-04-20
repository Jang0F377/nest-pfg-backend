import { Global, Module } from '@nestjs/common';
import { DateParserService } from './date-parser.service';

@Global()
@Module({
  providers: [DateParserService],
  exports: [DateParserService],
})
export class DateParserModule {}
