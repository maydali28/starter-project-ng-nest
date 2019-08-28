import { AccessPermissionsContract } from '@starter-project-ng-nest/core/global-contracts';
import { Request as ExpressRequest } from 'express';

export interface CoreRequest extends ExpressRequest {
  accessPermissions?: AccessPermissionsContract;
}
