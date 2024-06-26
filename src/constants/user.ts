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
  '-seshHistory',
  '-favoriteGames',
  '-supporter',
];

export const CONSTANT_PROJECTION = ['-role'];

export const POPULATE_PATH_SESH =
  'recipients sentFrom usersConfirmed usersUnconfirmed usersDeclined _createdAt status';

export const POPULATE_SELECT_SESH = '_id';

export enum SESH_STATUS {
  NOT_STARTED = 'notStarted',
  FINISHED = 'finished',
}
