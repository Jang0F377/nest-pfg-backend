import { Module } from '@nestjs/common';
import { DbUriService } from './db-uri.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [DbUriService],
  exports: [DbUriService],
})
export class DbUriModule {}
