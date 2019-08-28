import {
  BaseModel,
  schemaOptions
} from '@starter-project-ng-nest/core/global-contracts';
import { ModelType, prop } from 'typegoose';
import { IsNotEmpty } from 'class-validator';

export class Authentication extends BaseModel<Authentication> {
  @prop()
  userId?: string;

  @IsNotEmpty()
  @prop()
  email?: string;

  @IsNotEmpty()
  @prop()
  password?: string;

  static get model(): ModelType<Authentication> {
    return new Authentication().getModelForClass(Authentication, {
      schemaOptions
    });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}
