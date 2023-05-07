import { Global, Module } from '@nestjs/common';
import { PasswordHasherService } from './password-hasher.service';

@Global()
@Module({
  providers: [PasswordHasherService],
})
export class PasswordHasherModule {}
