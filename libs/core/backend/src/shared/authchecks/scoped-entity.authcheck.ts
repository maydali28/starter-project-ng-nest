import { AppError } from '../exceptions/app.exception';
import { AuthCheckContract } from './authcheck.contract';
import { AuthorizationCheckParams } from './authorization-params';
import { CrudOperations } from './crud-operations.enum';
import { ScopedAccessAuthCheck } from './scoped-access.authcheck';
import { ScopedData } from './scoped-data';
import { Typegoose } from 'typegoose';
//
// checks permissions against orgId and userId if these attributes exist on an entity
//
export class ScopedEntityAuthCheck extends AuthCheckContract<Typegoose, CrudOperations> {
  private scopedAccessAuthCheck = new ScopedAccessAuthCheck();

  public async isAuthorized(params: AuthorizationCheckParams<Typegoose, CrudOperations>): Promise<boolean> {
    if (!params.targetResource || !params.targetResource) throw new AppError('target.resource can not be null');

    const scopedParams = {
      accessPermissions: params.accessPermissions,
      origin: params.origin,
      operation: params.operation,
      targetResource: new ScopedData(),
      data: params.data,
    };


    scopedParams.targetResource.userId = params.targetResource['userId'];
    scopedParams.targetResource.orgId = params.targetResource['orgId'];

    return this.scopedAccessAuthCheck.isAuthorized(params);
  }
}
