import { Injectable } from '@nestjs/common';
import { AuthenticationRepo } from '../repo/authentication.repo';
import { Messages } from './messages.constants';
import { Authentication } from '../model/authentication.model';
import { ValidationError } from '../../../../shared/exceptions/validation.exception';

export interface IAuthenticationCreateValidatorOptions {
  skipUserIdValidation: boolean;
}
@Injectable()
export class DeprecatedAuthenticationCreateValidator {
  constructor(private readonly authenticationRepo: AuthenticationRepo) {}

  public async validate(
    authenticationEntity: Authentication,
    options?: IAuthenticationCreateValidatorOptions
  ) {
    const messages: string[] = [];

    if (!options || !options.skipUserIdValidation) {
      if (!authenticationEntity.userId)
        messages.push(Messages.USER_ID_REQUIRED);
    }

    if (authenticationEntity.email) {
      if (
        await this.authenticationRepo.findOne(
          { email: authenticationEntity.email },
          { skipAuthorization: true }
        )
      ) {
        messages.push(Messages.EMAIL_IN_USE);
      }
    }

    if (messages.length > 0) throw new ValidationError(messages);
  }
}
