import { AppError } from "../../../../../shared/exceptions/app.exception";
import { Inject, Injectable } from '@nestjs/common';
import { create as createOAuth2Client, OAuthClient, Token as OAuthClientToken } from 'simple-oauth2';
import { AppConfigProviderTokens } from "../../../../../configuration";
import { ICoreConfig } from "../../../../../configuration/core.config";
import { LoggerSharedService } from "../../../../../shared/logging/logger.shared.service";
import { IOauthAccessToken } from "../i-oauth-access-token";
@Injectable()
export class FacebookAuthenticationService {
    private oauthClient: OAuthClient;

    constructor(
        @Inject(AppConfigProviderTokens.Config.App)
        private readonly coreConfig: ICoreConfig,
        private readonly bffLoggerService: LoggerSharedService,
    ) {
        const oauthClientConfig = {
            client: {
                id: this.coreConfig.social.facebook.clientID,
                secret: this.coreConfig.social.facebook.clientSecret,
            },
            auth: {
                authorizeHost: this.coreConfig.social.facebook.authorizeHost,
                authorizePath: this.coreConfig.social.facebook.authorizePath,
                tokenHost: this.coreConfig.social.facebook.tokenHost,
                tokenPath: this.coreConfig.social.facebook.tokenPath,
            },
        };

        this.oauthClient = createOAuth2Client(oauthClientConfig);
    }

    /**
     *
     * @param spaRootUrl
     */
    public async getOauth2RedirectUrl(redirectUri: string): Promise<{ redirectUrl: string }> {
        const options = {
            redirect_uri: `${redirectUri}`,
            scope: this.coreConfig.social.facebook.authorizeScope.join(','),
            state: '', // TODO: assess.  not using ATM.  CSRF protection to be handled differently
        };

        const redirectUrl = this.oauthClient.authorizationCode.authorizeURL(options);

        return {
            redirectUrl,
        };
    }

    /**
     *
     * @param code
     */
    public async getOauthAccessToken(fbAuthorizationCode: string, spaRootUrl: string): Promise<IOauthAccessToken> {
        const tokenConfig = {
            code: `${fbAuthorizationCode}`,
            redirect_uri: `${spaRootUrl}${this.coreConfig.social.facebook.callbackRelativeURL_signIn}`,
            scope: this.coreConfig.social.facebook.authorizeScope,
        };

        try {
            // Get access token
            const result: OAuthClientToken = await this.oauthClient.authorizationCode.getToken(tokenConfig);
            return { token: result.access_token };
        } catch (error) {
            this.bffLoggerService.error('Error retrieving Facebook oAuth access token', error);
            throw new AppError('There was a problem authenticating you with Facebook');
        }
    }
}