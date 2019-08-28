import { ApiModelPropertyOptional } from '@nestjs/swagger';
import { SchemaOptions, Types } from 'mongoose';
import { Typegoose, prop, pre } from 'typegoose';
import { IsEmpty } from 'class-validator';

// @ts-ignore
@pre<T>('findOneAndUpdate', function() {
  this.update.updatedAt = new Date(Date.now());
})
// @ts-ignore
@pre<T>('save', function() {
  if (!this._id) this._id = new Types.ObjectId();
})
export abstract class BaseModel<T> extends Typegoose {
  @IsEmpty()
  @prop()
  _id?: Types.ObjectId;

  @prop({ default: Date.now() })
  createdAt!: Date;

  @prop({ default: Date.now() })
  updatedAt!: Date;

  @prop({ default: false })
  isDeleted!: boolean;
}

// tslint:disable-next-line:max-classes-per-file
export abstract class BaseModelVm {
  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  createdAt?: Date;

  @ApiModelPropertyOptional({ type: String, format: 'date-time' })
  updatedAt?: Date;
}

export const schemaOptions: SchemaOptions = {
  toJSON: {
    virtuals: true,
    getters: true
  }
};
