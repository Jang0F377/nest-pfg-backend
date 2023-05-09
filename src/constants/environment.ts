import { Config } from './types/environment';

export default (): Config => ({
  db: {
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    database: process.env.MONGO_DATABASE,
  },
  app: {
    secret: process.env.SECRET,
    saltRounds: process.env.SALT_ROUNDS,
  },
  node: {
    env: process.env.NODE_ENV,
  },
});
