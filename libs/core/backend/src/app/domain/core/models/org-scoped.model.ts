import { IsNotEmpty } from 'class-validator';
import { BaseModel } from '@starter-project-ng-nest/core/global-contracts';
import { prop } from 'typegoose';

export abstract class OrgScopedEntity<T> extends BaseModel<T> {
  @IsNotEmpty()
  @prop()
  public orgId: string | undefined = undefined;
}
