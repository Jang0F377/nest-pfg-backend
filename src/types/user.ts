import { ROLES } from 'src/constants/user';

export type Credentials = {
  email: string;
  password: string;
};

export type UserProfile = {
  sub: string;
  role: ROLES;
};
