import { SetMetadata } from '@nestjs/common';
import { ROLES, ROLES_KEY } from 'src/constants/user';

export const Role = (...roles: Array<ROLES>) => SetMetadata(ROLES_KEY, roles);
