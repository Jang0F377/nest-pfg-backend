import { Module } from '@nestjs/common';
import { DbUriModule } from './utils/db-uri/db-uri.module';
import { ConfigModule } from '@nestjs/config';
import config from './constants/environment';
import { MongooseModule } from '@nestjs/mongoose';
import { DbUriService } from './utils/db-uri/db-uri.service';
import { HealthcheckController } from './healthcheck/healthcheck.controller';
import { JwtModule } from './services/jwt/jwt.module';
import { UserModule } from './modules/user/user.module';
import { SeshModule } from './modules/sesh/sesh.module';
import { PasswordHasherModule } from './services/password-hasher/password-hasher.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/guards/auth.guard';
import { JwtService } from './services/jwt/jwt.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ListenersModule } from './services/listeners/listeners.module';
import { LoggerModule } from 'nestjs-pino';
import { DateParserModule } from './services/date-parser/date-parser.module';
import { AgendaModule } from './services/agenda/agenda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      cache: true,
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        base: {
          service: 'pfg-api-service',
        },
      },
      exclude: [],
    }),
    DbUriModule,
    EventEmitterModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [DbUriModule],
      inject: [DbUriService],
      useFactory: async (dbUriService: DbUriService) => ({
        uri: await dbUriService.returnDatabaseUri(),
      }),
    }),
    JwtModule,
    UserModule,
    SeshModule,
    PasswordHasherModule,
    ListenersModule,
    DateParserModule,
    AgendaModule,
  ],
  controllers: [HealthcheckController],
  providers: [JwtService, { provide: APP_GUARD, useClass: AuthGuard }],
})
export class AppModule {}
