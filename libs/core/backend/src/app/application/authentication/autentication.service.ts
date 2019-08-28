import {
  LocalAuthenticateMv,
  LocalRegisterMv,
  OrganizationRoles,
  Roles
} from '@starter-project-ng-nest/core/global-contracts';
import { Injectable } from '@nestjs/common';
import { AccessPermissions } from '../../domain/access-permissions/model/access-permissions.model';
import { AccessPermissionsRepo } from '../../domain/access-permissions/repo/access-permissions.repo';
import { AuthenticationRepo } from '../../domain/authentication/repo/authentication.repo';
import { FacebookAuthenticationService } from '../../domain/authentication/social/facebook/facebook-authentication.service';
import { FacebookProfileService } from '../../domain/authentication/social/facebook/facebook-profile.service';
import {
  generateHashedPassword,
  validPassword
} from '../../domain/authentication/utils/encryption.utils';
import { OrganizationRepo } from '../../domain/organization/repo/organization.repo';
import { UserRepo } from '../../domain/user/repo/user.repo';
import { AppError } from '../../../shared/exceptions/app.exception';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { generateCode } from '../../../utilities/codeGenerate';
import { DeprecatedAuthenticationCreateValidator } from '../../domain/authentication/validators/depricated-authentication-create.validator';
import { MailerService } from '../../../shared/mailer/mailer.service';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly logger: LoggerSharedService,
    private readonly fbAuthenticationService: FacebookAuthenticationService,
    private readonly fbProfileService: FacebookProfileService,
    private readonly authenticationRepo: AuthenticationRepo,
    private readonly accessPermissionsRepo: AccessPermissionsRepo,
    private readonly deprecatedAuthenticationCreateValidator: DeprecatedAuthenticationCreateValidator,
    private readonly userRepo: UserRepo,
    private readonly organizationRepo: OrganizationRepo,
    private readonly mailerService: MailerService
  ) {}

  /**
   *
   * @param cmd
   */
  public async signInWithLocal(
    cmd: LocalAuthenticateMv
  ): Promise<AccessPermissions> {
    const authenticationEntity = await this.authenticationRepo.findOne(
      { email: cmd.email },
      { skipAuthorization: true }
    );

    if (!authenticationEntity)
      throw new ValidationError(['Your login credentials were not correct']);
    if (!authenticationEntity)
      throw new ValidationError([
        'Your login credentials were not correct or you do not have an account. Perhaps you registered with social login?'
      ]);
    if (!authenticationEntity.userId)
      throw new AppError('UserId can not be null');

    if (!validPassword(cmd.password, authenticationEntity.password))
      throw new ValidationError(['Your login credentials were not correct']);
    this.logger.debug('authenticationEntity', authenticationEntity);

    const accessPermissions = await this.accessPermissionsRepo.findOne(
      { userId: authenticationEntity.userId },
      { skipAuthorization: true }
    );

    this.logger.debug('authenticationEntity', accessPermissions._id);

    if (!accessPermissions)
      throw new AppError(
        'Could not find access permission information for signIn'
      );

    this.logger.debug('accessPermissions', accessPermissions);

    return accessPermissions;
  }

  /**
   *
   * @param cmd
   */
  public async signUpWithLocal(
    cmd: LocalRegisterMv
  ): Promise<AccessPermissions> {
    // const authenticationEntity = await this.authenticationRepo.findOne({ email: cmd.email }, { skipAuthorization: true });
    // if (authenticationEntity) throw new ValidationError(['user with the same email already signup']);

    //
    // setup commands
    //
    const newAuthenticationEntity = {
      userId: '',
      email: cmd.email,
      password: generateHashedPassword(cmd.password)
    };

    const testEntity = this.authenticationRepo.createObject(
      newAuthenticationEntity
    );

    await this.deprecatedAuthenticationCreateValidator.validate(testEntity, {
      skipUserIdValidation: true
    });

    //
    // validate
    //
    await this.authenticationRepo.entityValidator.validate(
      newAuthenticationEntity
    );

    //
    // execute
    //

    // create new user
    const userModel = this.userRepo.createObject({
      email: cmd.email,
      displayName: cmd.displayName
    });

    // TODO : change verify mec

    userModel.code = generateCode('US');
    try {
      while ((await this.userRepo.findBycode(userModel.code)) !== null) {
        userModel.code = generateCode('US');
      }
    } catch (err) {}

    const user = await this.userRepo.create(userModel, {
      skipAuthorization: true
    });

    this.logger.debug(`update`, user);

    // create authentication

    newAuthenticationEntity.userId = user.id;

    const newBid = this.authenticationRepo.createObject(
      newAuthenticationEntity
    );

    await this.authenticationRepo.create(newBid, {
      skipAuthorization: true
    });

    const orgSlug = cmd.type.toLowerCase();

    const organization = await this.organizationRepo.findOne(
      { slug: orgSlug },
      { skipAuthorization: true }
    );

    if (!organization)
      throw new AppError(`Could not find organization with Slug: ${orgSlug}`);

    this.logger.debug('organization', organization);

    // create authorization
    const accessPermissionsModel = this.accessPermissionsRepo.createObject({
      userId: user.id,
      roles: [Roles.user],
      organizations: [
        {
          primary: true,
          orgId: organization.id,
          organizationRoles: [OrganizationRoles.member]
        }
      ]
    });

    const accessPermissions = this.accessPermissionsRepo.create(
      accessPermissionsModel,
      { skipAuthorization: true }
    );

    this.mailerService.send(user.email, {
      view: 'verifyEmail',
      locals: {
        fname: user.displayName,
        lname: 'maymay'
      }
    });

    this.logger.debug('accessPermissions', accessPermissions);

    return accessPermissions;
  }
  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signUpWithFacebook(
    fbAuthorizationCode: string,
    spaRootUrl: string
  ): Promise<AccessPermissions> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(
      fbAuthorizationCode,
      spaRootUrl
    );

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(
      fbAuthorizationToken
    );

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findOne(
      { facebook: { id: fbProfile.id } },
      { skipAuthorization: true }
    );
    if (authenticationEntity)
      throw new AppError('Could not find authorization information for signIn');

    // create new user
    const userModel = this.userRepo.createObject({
      email: fbProfile.email,
      displayName: fbProfile.name
    });

    // create new user
    const user = await this.userRepo.create(userModel, {
      skipAuthorization: true
    });

    const authenticateModel = this.authenticationRepo.createObject({
      userId: user.id,
      email: fbProfile.email
    });

    // create authentication
    this.authenticationRepo.create(authenticateModel, {
      skipAuthorization: true
    });

    // create authorization
    const accessPermissionsModel = this.accessPermissionsRepo.createObject({
      userId: user.id,
      roles: [Roles.user],
      organizations: []
    });

    // create authorization
    const accessPermissionsEntity = this.accessPermissionsRepo.create(
      accessPermissionsModel,
      { skipAuthorization: true }
    );

    return accessPermissionsEntity;
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signInWithFacebook(
    fbAuthorizationCode: string,
    spaRootUrl: string
  ): Promise<AccessPermissions> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(
      fbAuthorizationCode,
      spaRootUrl
    );

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(
      fbAuthorizationToken
    );

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findOne(
      { facebook: { id: fbProfile.id } },
      { skipAuthorization: true }
    );
    if (!authenticationEntity)
      throw new AppError(
        'Could not find authentication information for signIn'
      );

    const accessPermissionsEntity = await this.accessPermissionsRepo.findOne(
      { userId: authenticationEntity.userId },
      { skipAuthorization: true }
    );
    if (!accessPermissionsEntity)
      throw new AppError('Could not find authorization information for signIn');

    return accessPermissionsEntity;
  }
}
