import { IsEmail, IsString, Length } from 'class-validator';
import { BaseModelVm } from '../../domain/core/base.model';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class LocalAuthenticateMv extends BaseModelVm {
    @IsEmail()
    @Length(6, 64)
    @ApiModelPropertyOptional({ type: String })
    public readonly email: string = '';

    @IsString()
    @Length(8, 32)
    @ApiModelPropertyOptional({ type: String })
    public readonly password: string = '';
}