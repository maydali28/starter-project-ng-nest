import { Module } from '@nestjs/common';
import { DomainAccessPermissionsModule } from '../../../app/domain/access-permissions/access-permissions.module';
import { CachingSharedModule } from '../../../shared/caching/caching.shared.module';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { AuthorizationGuard } from './guards/authorization.guard';
import { JwtTokenService } from './jwt/jwt-token.service';
import { ConfigurationModule } from '../../../configuration/configuration.module';
import { DomainOrganizationModule } from '../../domain/organization/organization.module';
import { AttachAuthenticationHttpMiddleware } from './middleware/attach-authentication.middleware';

@Module({
  imports: [ConfigurationModule, DomainAccessPermissionsModule, DomainOrganizationModule, LoggingSharedModule, CachingSharedModule],
  providers: [AuthorizationGuard, AttachAuthenticationHttpMiddleware, JwtTokenService],
  exports: [ConfigurationModule, DomainAccessPermissionsModule, DomainOrganizationModule, LoggingSharedModule, CachingSharedModule, AttachAuthenticationHttpMiddleware, JwtTokenService],
})
export class HttpCoreModule { }