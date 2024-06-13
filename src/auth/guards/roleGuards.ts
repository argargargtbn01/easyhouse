/* eslint-disable prettier/prettier */
import { SetMetadata } from '@nestjs/common';
export enum Role {
  ADMIN = 'admin',
  MERCHANT = 'merchant',
  CUSTOMER = 'customer',
}
export const ROLES_KEY = 'roles';
export const Roles = (roles: Role[]) => SetMetadata(ROLES_KEY, roles);
