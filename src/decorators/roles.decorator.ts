import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY, RolesEnum } from 'shared/constants';

export const Roles = (...roles: RolesEnum[]) => SetMetadata(ROLES_KEY, roles);
