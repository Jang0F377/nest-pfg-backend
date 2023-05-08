export const IS_PUBLIC_KEY = 'isPublic';

export const ROLES_KEY = 'roles';

export enum ROLES {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'superAdmin',
}

export const USER_SESH_PROJECTION = [
  '-upcomingAcceptedSeshes',
  '-upcomingDeclinedSeshes',
  '-upcomingUndecidedSeshes',
  '-recentSeshes',
  '-favoriteGames',
  '-supporter',
];

export const CONSTANT_PROJECTION = ['-role'];
