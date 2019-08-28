import { Module } from '@nestjs/common';
import { UserAuthModule } from '../../../../app/application/authentication/authentication.module';
import { DomainAccessPermissionsModule } from '../../../../app/domain/access-permissions/access-permissions.module';
import { DomainAuthenticationModule } from '../../../../app/domain/authentication/authentication.module';
import { HttpCoreModule } from '../../core/core.module';
import { AuthController } from './authentication.controller';

@Module({
  imports: [
    HttpCoreModule,
    UserAuthModule,
    DomainAuthenticationModule,
    DomainAccessPermissionsModule
  ],
  controllers: [AuthController],
  providers: [],
  exports: []
})
export class HttpAuthModule {}
