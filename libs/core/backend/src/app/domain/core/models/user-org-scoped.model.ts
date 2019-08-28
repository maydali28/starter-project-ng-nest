import { IsNotEmpty } from 'class-validator';
import { OrgScopedEntity } from './org-scoped.model';
import { prop } from 'typegoose';

export abstract class UserAndOrgScopedEntity<T> extends OrgScopedEntity<T> {
  @IsNotEmpty()
  @prop()
  public userId: string | undefined = undefined;
}
