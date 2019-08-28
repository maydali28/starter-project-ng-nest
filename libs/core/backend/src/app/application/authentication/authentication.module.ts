import { Module } from '@nestjs/common';
import { ApplicationCoreModule } from '../core/core.module';
import { DomainAuthenticationModule } from '../../domain/authentication/authentication.module';
import { DomainAccessPermissionsModule } from '../../domain/access-permissions/access-permissions.module';
import { DomainUserModule } from '../../domain/user/user.module';
import { DomainOrganizationModule } from '../../domain/organization/organization.module';
import { UserAuthService } from './autentication.service';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { MailerSharedModule } from '../../../shared/mailer/mailer.module';

@Module({
  imports: [
    MailerSharedModule,
    LoggingSharedModule,
    ApplicationCoreModule,
    DomainAuthenticationModule,
    DomainAccessPermissionsModule,
    DomainUserModule,
    DomainOrganizationModule
  ],
  providers: [UserAuthService],
  exports: [UserAuthService]
})
export class UserAuthModule {}
