import { prop } from 'typegoose';
import { Length } from 'class-validator';
import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModel, BaseModelVm } from './base.model';

export abstract class LabeledBaseModel<T> extends BaseModel<T> {
  @Length(2, 50)
  @prop()
  label?: string;

  @Length(2, 50)
  @prop()
  code?: string;
}

export abstract class LabeledBaseModelVm extends BaseModelVm {
  @ApiModelPropertyOptional({ type: String })
  label?: Date;

  @ApiModelPropertyOptional({ type: String })
  code?: string;
}
