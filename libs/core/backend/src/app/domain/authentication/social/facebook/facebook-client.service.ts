import { Injectable, Inject } from '@nestjs/common';
import { AppConfigProviderTokens } from '../../../../../configuration';
import { ICoreConfig } from '../../../../../configuration/core.config';
import { LoggerSharedService } from '../../../../../shared/logging/logger.shared.service';
import { IAuthenticationToken } from '@starter-project-ng-nest/core/global-contracts';
import { createHmac } from 'crypto';
import axios from 'axios';

@Injectable()
export class FacebookClientService {
  constructor(
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly coreConfig: ICoreConfig,
    private readonly bffLoggerService: LoggerSharedService
  ) {}

  public async get(
    getRequest: string,
    accessToken: IAuthenticationToken
  ): Promise<any> {
    // Secure API call by adding proof of the app secret.  This is required when
    // the "Require AppSecret Proof for Server API calls" setting has been
    // enabled.  The proof is a SHA256 hash of the access token, using the app
    // secret as the key.
    //
    // For further details, refer to:
    // https://developers.facebook.com/docs/reference/api/securing-graph-api/
    const proof = createHmac(
      'sha256',
      this.coreConfig.social.facebook.clientSecret
    )
      .update(accessToken.token)
      .digest('hex');

    this.bffLoggerService.debug(
      'FacebookClientService-get-coreConfig',
      this.coreConfig
    );

    // Get profile data
    const getRequestWithAuth =
      `${this.coreConfig.social.facebook.apiHost}` +
      getRequest +
      `&access_token=${accessToken.token}` +
      `&appsecret_proof=${proof}`;

    // Submit request
    this.bffLoggerService.debug(
      'FacebookClientService-get-getRequestWithAuth',
      getRequestWithAuth
    );
    const result = await axios.get(getRequestWithAuth);
    this.bffLoggerService.debug(
      'FacebookClientService-get-result.data',
      result.data
    );

    return result.data;
  }
}
