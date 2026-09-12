import { applyDecorators, UseGuards } from '@nestjs/common';
import { Roles } from './roles.decorator.js';
import { RolesGuard } from '../guards/roles.guard.js';
import { UserRole } from '../../users/entities/user-role.enum.js';

export const AdminOnly = () => applyDecorators(UseGuards(RolesGuard), Roles(UserRole.ADMIN));
