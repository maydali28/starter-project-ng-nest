import { BaseModel } from '../core/base.model';
import { Length } from 'class-validator';
import { prop } from 'typegoose';

export class OrganizationModel extends BaseModel<OrganizationModel> {
    @Length(2, 50)
    @prop()
    name?: string;

    @Length(2, 50)
    @prop()
    slug?: string;

}
