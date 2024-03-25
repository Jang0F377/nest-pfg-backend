import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigServiceType, DbConfig } from 'src/constants/types/environment';

@Injectable()
export class DbUriService {
  constructor(private configService: ConfigService<ConfigServiceType>) {}

  private connectionOptions = [
    'authSource=admin',
    'replicaSet=mongodb',
    'ssl=false',
  ];

  public async returnDatabaseUri(): Promise<string> {
    const db = this.configService.get<DbConfig>('db');
    const user = db.username;
    const pass = db.password;
    let uri: string;
    console.log(db);

    if (user && pass) {
      uri = `mongodb://${user}:${pass}@${db.host}:${db.port}/${
        db.database
      }?${this.connectionOptions.join('&')}`;
    } else {
      uri = `mongodb://${db.host}:${db.port}/${db.database}`;
    }
    return uri;
  }
}
