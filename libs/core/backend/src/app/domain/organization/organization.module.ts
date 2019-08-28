import { DomainCoreModule } from '../core/domain-core.module';
import { OrganizationRepo } from './repo/organization.repo';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { Organization } from './model/organization.model';

@Module({
  imports: [
    DomainCoreModule,
    MongooseModule.forFeature([
      { name: Organization.modelName, schema: Organization.model.schema }
    ])
  ],
  providers: [OrganizationRepo],
  exports: [OrganizationRepo]
})
export class DomainOrganizationModule {}
