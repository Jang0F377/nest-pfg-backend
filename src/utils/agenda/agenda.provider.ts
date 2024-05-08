import { ConfigService } from '@nestjs/config';
import { AGENDA_CONNECTION } from 'src/constants/agenda';
import { ConfigServiceType, DbConfig } from 'src/constants/types/environment';

export const agendaProvider = {
  provide: AGENDA_CONNECTION,
  useFactory: async (
    configService: ConfigService<ConfigServiceType>,
  ): Promise<AgendaUri> => {
    const connectionOptions = [
      'authSource=admin',
      // 'replicaSet=mongodb',
      // 'ssl=false',
    ];
    const db = configService.get<DbConfig>('db');
    const user = db.username;
    const pass = db.password;
    let address: string;

    if (user && pass) {
      address = `mongodb://${user}:${pass}@${db.host}:${db.port}/${
        db.database
      }?${connectionOptions.join('&')}`;
    } else {
      address = `mongodb://${db.host}:${db.port}/${db.database}`;
    }
    return { db: { address } };
  },
  inject: [ConfigService],
};

export interface AgendaUri {
  db: {
    address: string;
  };
}
