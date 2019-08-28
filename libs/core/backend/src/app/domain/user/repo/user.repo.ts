import { Injectable, Inject } from "@nestjs/common";
import { BaseService } from "../../core/repo/repo.base";
import { LoggerSharedService } from "../../../../shared/logging/logger.shared.service";
import { AppConfigProviderTokens } from "../../../../configuration";
import { ICoreConfig } from "../../../../configuration/core.config";
import { CacheStore } from "../../../../shared/caching/cache-store.shared";
import { ModelType } from "typegoose";
import { InjectModel } from "@nestjs/mongoose";
import { CachingProviderTokens } from "../../../../shared/caching/caching.shared.constants";
import { MapperService } from "../../core/mapper/mapper.service";
import { ClassValidator } from "../../core/validation/validation";
import { User } from "../model/user.model";

@Injectable()
export class UserRepo extends BaseService<User> {
    constructor(
        loggerService: LoggerSharedService,
        @Inject(AppConfigProviderTokens.Config.App) coreConfig: ICoreConfig,
        @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
        @InjectModel(User.modelName) model: ModelType<User>,
        readonly mapperService: MapperService,
    ) {
        super({
            loggerService,
            model,
            cacheStore,
            entityValidator: new ClassValidator(loggerService, User),
            defaultTTL: coreConfig.caching.entities.user,
            mapper: mapperService.mapper
        });
    }

    protected generateValidQueryConditionsForCacheClear(entity: User): object[] {
        return [{ id: entity._id, username: entity.email }];
    }
}