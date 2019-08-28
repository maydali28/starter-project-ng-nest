import { AppConfigProviderTokens } from '../../../../configuration';
import {
  Inject,
  Controller,
  Post,
  Body,
  Get,
  Req,
  HttpStatus,
  HttpCode
} from '@nestjs/common';
import { ICoreConfig } from '../../../../configuration/core.config';
import { FacebookAuthenticationService } from '../../../../app/domain/authentication/social/facebook/facebook-authentication.service';
import { UserAuthService } from '../../../../app/application/authentication/autentication.service';
import { JwtTokenService } from '../../core/jwt/jwt-token.service';
import { LocalRegisterMv } from '@starter-project-ng-nest/core/global-contracts';
import { IAuthenticationToken } from '@starter-project-ng-nest/core/global-contracts';
import { LocalAuthenticateMv } from '@starter-project-ng-nest/core/global-contracts';
import { CoreRequest } from '../../core/types/core-request.contract';
import { AccessPermissionsContract } from '@starter-project-ng-nest/core/global-contracts';
import {
  ApiBearerAuth,
  ApiUseTags,
  ApiResponse,
  ApiImplicitBody,
  ApiImplicitParam
} from '@nestjs/swagger';
import { Authorization } from '../../core/decorators/authorization.decorator';
import { OrgRolesAuthCheck } from '../../../../shared/authchecks/org-roles.authcheck';
import { RoleAuthCheck } from '../../../../shared/authchecks/role.authcheck';
import {
  Roles,
  OrganizationRoles
} from '@starter-project-ng-nest/core/global-contracts';
import { OrgAccessAuthCheck } from '../../../../shared/authchecks/org-access.authcheck';

@Controller('auth')
@ApiUseTags('auth')
export class AuthController {
  constructor(
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly coreConfig: ICoreConfig,
    private readonly authFacebookService: FacebookAuthenticationService,
    private readonly userAuthenticationService: UserAuthService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @Post('public/local/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: `API View that receives a POST with a user's informations.
    Returns a JSON Web Token that can be used for authenticated requests.`
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  async localSignUp(
    @Body() localRegisterCmd: LocalRegisterMv
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signUpWithLocal(
      localRegisterCmd
    );

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'API View that receives a POST with a user\'s informations. returning the token if it is valid.'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Post('public/local/signin')
  async localSignIn(
    @Body() localAuthenticateCmd: LocalAuthenticateMv
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signInWithLocal(
      localAuthenticateCmd
    );

    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Facebook Signin Redirection'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Get('public/facebook/oauth2url/sign-in')
  async getOauth2UrlForFacebookSignIn(): Promise<{ redirectUrl: string }> {
    return this.authFacebookService.getOauth2RedirectUrl(
      `${this.coreConfig.http.rootUrl}${
        this.coreConfig.social.facebook.callbackRelativeURL_signIn
      }`
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Facebook Signup Redirection'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Get('public/facebook/oauth2url/sign-up')
  async getOauth2UrlForFacebookSignUp(): Promise<{ redirectUrl: string }> {
    return this.authFacebookService.getOauth2RedirectUrl(
      `${this.coreConfig.http.rootUrl}${
        this.coreConfig.social.facebook.callbackRelativeURL_signUp
      }`
    );
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signup using Facebook API'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitBody({ name: 'fbAuthorizationCode', type: String })
  @Post('public/facebook/signUp')
  async signUpWithFacebook(
    @Body('fbAuthorizationCode') fbAuthorizationCode: string
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signUpWithFacebook(
      fbAuthorizationCode,
      this.coreConfig.http.rootUrl
    );
    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Signin using Facebook API'
  })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @ApiImplicitBody({ name: 'fbAuthorizationCode', type: String })
  @Post('public/facebook/signin')
  async signInWithFacebook(
    @Body('fbAuthorizationCode') fbAuthorizationCode: string
  ): Promise<IAuthenticationToken> {
    const authenticationEntity = await this.userAuthenticationService.signInWithFacebook(
      fbAuthorizationCode,
      this.coreConfig.http.rootUrl
    );
    return this.jwtTokenService.createToken(authenticationEntity);
  }

  @Get('authorization')
  @ApiBearerAuth()
  @Authorization([new OrgAccessAuthCheck()])
  public async getAuthorization(
    @Req() req: CoreRequest
  ): Promise<{ accessPermissions?: AccessPermissionsContract }> {
    return { accessPermissions: req.accessPermissions };
  }

  // -- SYSTEM VERIFICATION ENDPOINTS --//
  @Get('public/verification')
  async verificationPublic(): Promise<string> {
    return 'hit';
  }

  @ApiBearerAuth()
  @Get('verification/no-authorization-decorator')
  async verificationNoAuthorizationDecorator(): Promise<string> {
    return 'hit';
  }

  @Get('verification/role-protected-group-admin')
  @ApiBearerAuth()
  @Authorization([new RoleAuthCheck(Roles.groupAdmin)])
  async verificationRoleProtectedGroupAdmin(): Promise<string> {
    return 'hit';
  }

  @Get(':organizationSlug/verification/organization-protected-member')
  @ApiImplicitParam({ name: 'organizationSlug', type: String })
  @ApiBearerAuth()
  @Authorization([new OrgAccessAuthCheck()])
  async verificationOrganizationProtectedMember(): Promise<string> {
    return 'hit';
  }

  @Get(':organizationSlug/verification/organization-protected-admin')
  @ApiImplicitParam({ name: 'organizationSlug', type: String })
  @ApiBearerAuth()
  @Authorization([new OrgRolesAuthCheck([OrganizationRoles.admin])])
  async verificationOrganizationProtectedAdmin(): Promise<string> {
    return 'hit';
  }
}
