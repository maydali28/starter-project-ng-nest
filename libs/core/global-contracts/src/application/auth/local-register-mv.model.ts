import { IsEmail, IsString, Length, IsEnum } from 'class-validator';
import { BaseModelVm } from '../../domain/core/base.model';
import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class LocalRegisterMv extends BaseModelVm {
  @IsEmail()
  @Length(6, 64)
  @ApiModelPropertyOptional({ type: String })
  public readonly email: string = '';

  @IsString()
  @Length(1, 32)
  @ApiModelPropertyOptional({ type: String })
  public readonly displayName: string = '';

  @IsString()
  @Length(8, 32)
  @ApiModelPropertyOptional({ type: String })
  public readonly password: string = '';

  @IsEnum(['CLIENT', 'WRITER'])
  @ApiModelPropertyOptional({ enum: ['CLIENT', 'WRITER'] })
  public readonly type!: string;
}
