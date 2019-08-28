import { ModelType } from 'typegoose';
import { schemaOptions } from '@starter-project-ng-nest/core/global-contracts';
import { OrganizationModel } from '@starter-project-ng-nest/core/global-contracts';

export class Organization extends OrganizationModel {
  static get model(): ModelType<Organization> {
    return new Organization().getModelForClass(Organization, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}
