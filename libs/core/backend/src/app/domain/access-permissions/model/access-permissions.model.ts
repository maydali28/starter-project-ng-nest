import { ModelType, prop } from 'typegoose';
import {
  IsNotEmpty,
  IsArray,
  IsIn,
  ValidateNested,
  IsBoolean
} from 'class-validator';
import {
  Roles,
  OrganizationRoles,
  BaseModel,
  schemaOptions,
  UserOrgPermissionsContract
} from '@starter-project-ng-nest/core/global-contracts';

export class AccessPermissions extends BaseModel<AccessPermissions> {
  @IsNotEmpty()
  @prop()
  userId?: string;

  @IsArray()
  @IsIn([Roles.user, Roles.groupAdmin, Roles.staffAdmin, Roles.systemAdmin], {
    each: true
  })
  @prop()
  roles: string[] = [Roles.user];

  @ValidateNested()
  @prop()
  organizations?: OrganizationAuthorization[] = [];

  static get model(): ModelType<AccessPermissions> {
    return new AccessPermissions().getModelForClass(AccessPermissions, {
      schemaOptions
    });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}

export class OrganizationAuthorization implements UserOrgPermissionsContract {
  @IsBoolean()
  @prop()
  primary?: boolean;

  @IsNotEmpty()
  @prop()
  orgId?: string;

  @IsArray()
  @IsIn([OrganizationRoles.member, OrganizationRoles.admin], { each: true })
  @prop()
  organizationRoles: string[] = [];

  static get model(): ModelType<AccessPermissions> {
    return new AccessPermissions().getModelForClass(AccessPermissions, {
      schemaOptions
    });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}
