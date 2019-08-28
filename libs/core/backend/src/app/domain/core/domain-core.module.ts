import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../../../configuration/configuration.module';
import { LoggingSharedModule } from '../../../shared/logging/logging.shared.module';
import { CachingSharedModule } from '../../../shared/caching/caching.shared.module';
import { MapperService } from './mapper/mapper.service';

@Module({
  imports: [ConfigurationModule, LoggingSharedModule, CachingSharedModule],
  providers: [MapperService],
  exports: [
    MapperService,
    ConfigurationModule,
    LoggingSharedModule,
    CachingSharedModule
  ]
})
export class DomainCoreModule {}
