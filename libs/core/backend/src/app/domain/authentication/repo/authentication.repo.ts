import { Inject, Injectable } from '@nestjs/common';
import { ModelType } from 'typegoose';
import { BaseService } from '../../core/repo/repo.base';
import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { CachingProviderTokens } from '../../../../shared/caching/caching.shared.constants';
import { CacheStore } from '../../../../shared/caching/cache-store.shared';
import { ICoreConfig } from '../../../../configuration/core.config';
import { AppConfigProviderTokens } from '../../../../configuration';
import { InjectModel } from '@nestjs/mongoose';
import { MapperService } from '../../core/mapper/mapper.service';
import { ClassValidator } from '../../core/validation/validation';
import { Authentication } from '../model/authentication.model';

@Injectable()
export class AuthenticationRepo extends BaseService<Authentication> {
    constructor(
        readonly loggerService: LoggerSharedService,
        @InjectModel(Authentication.modelName) model: ModelType<Authentication>,
        @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
        @Inject(AppConfigProviderTokens.Config.App) coreConfig: ICoreConfig,
        readonly mapperService: MapperService,
    ) {
        super({
            loggerService,
            model,
            cacheStore,
            defaultTTL: coreConfig.caching.entities.user,
            entityValidator: new ClassValidator(loggerService, Authentication),
            mapper: mapperService.mapper
        });
    }

    protected generateValidQueryConditionsForCacheClear(entity: Authentication): object[] {
        return [{ id: entity._id, userId: entity.userId }];
    }
}