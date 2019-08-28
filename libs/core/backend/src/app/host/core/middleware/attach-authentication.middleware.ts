import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { verify, VerifyOptions } from 'jsonwebtoken';
import { ICoreConfig } from '../../../../configuration/core.config';
import { AccessPermissions } from '../../../domain/access-permissions/model/access-permissions.model';
import { AccessPermissionsRepo } from '../../../domain/access-permissions/repo/access-permissions.repo';
import { AppConfigProviderTokens } from '../../../../configuration';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { BadRequestHttpError } from '../exceptions/server.exception';
import { IJwtPayload } from '../jwt/i-jwt-payload';
import { getReqMetadataLite, parseAuthHeader } from '../utils/core.utils';
import { NextFunction } from 'express';
import { CoreRequest } from '../types/core-request.contract';

@Injectable()
export class AttachAuthenticationHttpMiddleware implements NestMiddleware {
  private static BEARER_AUTH_SCHEME = 'bearer';
  private static AUTH_HEADER = 'authorization';

  private verifyOptions: VerifyOptions;

  constructor(
    private readonly loggerService: LoggerSharedService,
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly coreConfig: ICoreConfig,
    private readonly accessPermissionsRepo: AccessPermissionsRepo
  ) {
    this.verifyOptions = {
      issuer: coreConfig.jwt.issuer,
      audience: coreConfig.http.rootUrl,
      algorithms: [coreConfig.jwt.signingAlgorithm]
    };
  }

  async use(req: CoreRequest, res: Response, next: NextFunction) {
    try {
      this.loggerService.trace('-- JwtMiddleware.resolve', {
        'req.originalUrl': req ? req.originalUrl : 'null'
      });
      await this.process(req);
    } catch (error) {
      this.loggerService.error('JwtMiddleware Error', error);
      if (next) next(error);
    }

    if (next) next();
  }

  private async process(req: any): Promise<void> {
    if (!req || !req.originalUrl) {
      this.loggerService.debug(
        'req.originalUrl is null',
        getReqMetadataLite(req)
      );
      return;
    }

    if (this.coreConfig.http.publicRouteRegex.test(req.originalUrl)) {
      this.loggerService.debug(`Public URL: ${req.originalUrl}`);
      return;
    }

    return this.attachAuthenticatedUserToRequest(req);
  }

  /**
   *
   *
   * @private
   * @param {*} req
   * @returns {Promise<void>}
   * @memberof JwtMiddleware
   */
  private async attachAuthenticatedUserToRequest(req): Promise<void> {
    const jwtToken = this.getJwtBearerTokenFromRequestHeader(req);
    if (!jwtToken) return;

    const jwtPayload = verify(
      jwtToken,
      this.coreConfig.jwt.jwtPublicKey,
      this.verifyOptions
    ) as IJwtPayload;

    if (!jwtPayload)
      throw new BadRequestHttpError(
        'Invalid JWT token',
        getReqMetadataLite(req)
      );

    let accessPermissions: AccessPermissions;
    try {
      accessPermissions = await this.accessPermissionsRepo.findById(
        jwtPayload.sub,
        { skipAuthorization: true }
      );
      this.loggerService.debug(
        `Attaching authorization to request${jwtPayload.sub}`,
        accessPermissions
      );
    } catch (error) {
      throw new BadRequestHttpError(
        `No authentication data found for request: ${
          req.originalUrl
        }, jwtPayload: ${JSON.stringify(jwtPayload)}`,
        error
      );
    }

    this.loggerService.debug(`Attaching authorization to request`, {
      'req.originalUrl': req.originalUrl,
      accessPermissions,
      org: accessPermissions.organizations
    });
    req.accessPermissions = accessPermissions;
  }

  /**
   *
   *
   * @private
   * @param {*} req
   * @returns {(string | undefined)}
   * @memberof JwtMiddleware
   */
  private getJwtBearerTokenFromRequestHeader(req): string | undefined {
    const authHdr = req.headers[AttachAuthenticationHttpMiddleware.AUTH_HEADER];

    if (!authHdr) {
      // log if authHdr not found
      this.loggerService.debug(
        `No auth header found for request: ${req.originalUrl}`
      );
      return undefined;
    }

    const parsedAuthHdr = parseAuthHeader(authHdr);
    if (!parsedAuthHdr) {
      throw new BadRequestHttpError(
        `Malformed auth header found for request: ${
          req.originalUrl
        } with authHdr ${authHdr}`,
        getReqMetadataLite(req)
      );
    }

    if (
      parsedAuthHdr.scheme !==
      AttachAuthenticationHttpMiddleware.BEARER_AUTH_SCHEME
    ) {
      throw new BadRequestHttpError(
        `Incorrect auth scheme. Bearer expected.  Found ${
          parsedAuthHdr.scheme
        }`,
        getReqMetadataLite(req)
      );
    }

    if (!parsedAuthHdr.value) {
      throw new BadRequestHttpError(
        'No auth header value found',
        getReqMetadataLite(req)
      );
    }

    return parsedAuthHdr.value;
  }
}
