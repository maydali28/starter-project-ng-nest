import { IAuthenticationToken } from '@starter-project-ng-nest/core/global-contracts';
import { IFacebookProfile } from './facebook-profile.interface';
import { AppError } from '../../../../../shared/exceptions/app.exception';
import { AppConfigProviderTokens } from '../../../../../configuration';
import { ICoreConfig } from '../../../../../configuration/core.config';
import { LoggerSharedService } from '../../../../../shared/logging/logger.shared.service';
import { FacebookClientService } from './facebook-client.service';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class FacebookProfileService {
  constructor(
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly coreConfig: ICoreConfig,
    private readonly bffLoggerService: LoggerSharedService,
    private readonly facebookClientService: FacebookClientService
  ) {}

  public async getProfile(
    accessToken: IAuthenticationToken
  ): Promise<IFacebookProfile> {
    try {
      // Get profile data
      const fbGetRequest = `${
        this.coreConfig.social.facebook.apiProfilePath
      }?fields=id,first_name,last_name,email`;
      const fbProfileResponse = await this.facebookClientService.get(
        fbGetRequest,
        accessToken
      );

      const result = {
        id: fbProfileResponse.id,
        email: fbProfileResponse.email,
        name: `${fbProfileResponse.first_name} ${fbProfileResponse.last_name}`
      };

      this.bffLoggerService.debug(
        'FacebookProfileService.getProfile.result',
        result
      );

      return result;
    } catch (error) {
      this.bffLoggerService.error(
        'Error retrieving Facebook profile data',
        error
      );
      throw new AppError(
        'There was a problem accessing Facebook information during authentication'
      );
    }
  }
}
