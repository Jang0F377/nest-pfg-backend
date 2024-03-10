import { ROLES } from 'src/constants/user';

export interface RegistrationObject extends Credentials {
  favoriteGames: Array<string>;
}

export interface Credentials {
  email: string;
  password: string;
}

export type UserProfile = {
  sub: string;
  role: ROLES;
};
