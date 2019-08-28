import { AuthCheckContract } from '../../../../shared/authchecks/authcheck.contract';
import { SetMetadata } from '@nestjs/common';

export const Authorization = (authchecks: Array<AuthCheckContract<any, any>>) =>
  SetMetadata('authorization', authchecks);
