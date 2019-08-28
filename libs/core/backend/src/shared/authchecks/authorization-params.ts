import { AccessPermissionsContract } from '@starter-project-ng-nest/core/global-contracts';

export class AuthorizationCheckParams<TResource, TOperations> {
  accessPermissions: AccessPermissionsContract | null | undefined;
  origin: string = '';
  operation?: TOperations;
  targetResource?: TResource;
  data?: any;
}
