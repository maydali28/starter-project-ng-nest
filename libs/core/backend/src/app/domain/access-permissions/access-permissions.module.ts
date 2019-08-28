import { Module } from '@nestjs/common';
import { DomainCoreModule } from '../core/domain-core.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AccessPermissions } from './model/access-permissions.model';
import { AccessPermissionsRepo } from './repo/access-permissions.repo';

@Module({
  imports: [
    DomainCoreModule,
    MongooseModule.forFeature([
      {
        name: AccessPermissions.modelName,
        schema: AccessPermissions.model.schema
      }
    ])
  ],
  providers: [AccessPermissionsRepo],
  exports: [AccessPermissionsRepo]
})
export class DomainAccessPermissionsModule {}
