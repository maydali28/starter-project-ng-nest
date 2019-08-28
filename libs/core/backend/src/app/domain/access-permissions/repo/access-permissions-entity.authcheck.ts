import { AccessPermissions } from '../model/access-permissions.model';
import { CrudOperations } from '../../../../shared/authchecks/crud-operations.enum';
import { AuthCheckContract } from '../../../../shared/authchecks/authcheck.contract';
import { OrganizationRoles } from '@starter-project-ng-nest/core/global-contracts';
import { OrgRolesAuthCheck } from '../../../../shared/authchecks/org-roles.authcheck';
import { AuthorizationCheckParams } from '../../../../shared/authchecks/authorization-params';
import { AppError } from '../../../../shared/exceptions/app.exception';
import { ScopedData } from '../../../../shared/authchecks/scoped-data';

//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class AccessPermissionsEntityAuthCheck extends AuthCheckContract<
  AccessPermissions,
  CrudOperations
> {
  private orgAdminAuthCheck = new OrgRolesAuthCheck([OrganizationRoles.admin]);

  public async isAuthorized(
    params: AuthorizationCheckParams<AccessPermissions, CrudOperations>
  ): Promise<boolean> {
    if (!params.targetResource || !params.targetResource)
      throw new AppError('target.resource can not be null');

    const scopedParams = {
      accessPermissions: params.accessPermissions,
      origin: params.origin,
      operation: params.operation,
      targetResource: new ScopedData(),
      data: params.data
    };

    if (params.targetResource.organizations) {
      for (const orgAccess of params.targetResource.organizations) {
        scopedParams.targetResource.orgId = orgAccess.orgId;
        await this.orgAdminAuthCheck.ensureAuthorized(scopedParams);
      }
    }

    // if authorization not already denied, then allow access (return true)
    return true;
  }
}
