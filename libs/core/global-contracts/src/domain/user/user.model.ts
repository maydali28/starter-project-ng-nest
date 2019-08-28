import { Length } from 'class-validator';
import { BaseModel, schemaOptions } from '../core/base.model';
import { ModelType, prop } from 'typegoose';

export class UserModel extends BaseModel<UserModel> {

    @prop({ required: true })
    code!: string;

    @Length(2, 50)
    @prop()
    email?: string;

    @Length(2, 50)
    @prop()
    displayName?: string;

    static get model(): ModelType<UserModel> {
        return new UserModel().getModelForClass(UserModel, { schemaOptions });
    }

    static get modelName(): string {
        return this.model.modelName;
    }
}