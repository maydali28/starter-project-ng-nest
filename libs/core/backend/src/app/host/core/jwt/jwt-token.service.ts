import { IAuthenticationToken } from '@starter-project-ng-nest/core/global-contracts';
import { Inject, Injectable } from '@nestjs/common';
import { sign, SignOptions } from 'jsonwebtoken';
import { ICoreConfig } from '../../../../configuration/core.config';
import { AccessPermissions } from '../../../domain/access-permissions/model/access-permissions.model';
import { AppConfigProviderTokens } from '../../../../configuration';
import { IJwtPayload } from './i-jwt-payload';

@Injectable()
export class JwtTokenService {
  private signOptions: SignOptions;

  constructor(
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly coreConfig: ICoreConfig
  ) {
    this.signOptions = {
      issuer: coreConfig.jwt.issuer,
      audience: coreConfig.http.rootUrl,
      algorithm: coreConfig.jwt.signingAlgorithm,
      expiresIn: coreConfig.jwt.expiresIn
    };
  }

  public async createToken(
    accessPermissions: AccessPermissions
  ): Promise<IAuthenticationToken> {
    const jwtPayload: Partial<IJwtPayload> = {
      sub: accessPermissions._id.toHexString(),
      roles: accessPermissions.roles
    };
    const token: string = sign(
      jwtPayload,
      {
        key: this.coreConfig.jwt.jwtPrivateKey,
        passphrase: this.coreConfig.jwt.jwtPrivateKeyPemPassphrase
      },
      this.signOptions
    );

    return { token };
  }
}
