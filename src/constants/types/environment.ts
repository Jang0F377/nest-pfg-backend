export interface DbConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  database: string;
}

export interface AppSecretsConfig {
  secret: string;
  saltRounds: string;
}

export interface NodeConfig {
  env: string;
}

export interface Config {
  db: DbConfig;
  app: AppSecretsConfig;
  node: NodeConfig;
}

export type ConfigServiceArgs =
  | keyof Config
  | `db.${keyof DbConfig}`
  | `app.${keyof AppSecretsConfig}`
  | `app.${keyof NodeConfig}`;

export type ConfigServiceType = Record<ConfigServiceArgs, string>;
