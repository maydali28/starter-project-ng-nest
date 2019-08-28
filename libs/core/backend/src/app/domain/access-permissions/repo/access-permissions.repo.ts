import { BaseService } from "../../core/repo/repo.base";
import { AccessPermissions } from "../model/access-permissions.model";
import { LoggerSharedService } from "../../../../shared/logging/logger.shared.service";
import { CacheStore } from "../../../../shared/caching/cache-store.shared";
import { CachingProviderTokens } from "../../../../shared/caching/caching.shared.constants";
import { AppConfigProviderTokens } from "../../../../configuration";
import { ICoreConfig } from "../../../../configuration/core.config";
import { ClassValidator } from "../../core/validation/validation";
import { ModelType } from "typegoose";
import { Inject, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { MapperService } from "../../core/mapper/mapper.service";
import { AccessPermissionsEntityAuthCheck } from "./access-permissions-entity.authcheck";

@Injectable()
export class AccessPermissionsRepo extends BaseService<AccessPermissions> {

    constructor(
        readonly loggerService: LoggerSharedService,
        @InjectModel(AccessPermissions.modelName) model: ModelType<AccessPermissions>,
        @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
        @Inject(AppConfigProviderTokens.Config.App) config: ICoreConfig,
        readonly mapperService: MapperService,
    ) {
        super({
            loggerService,
            model,
            cacheStore,
            defaultTTL: config.caching.entities.authorization,
            entityValidator: new ClassValidator(loggerService, AccessPermissions),
            entityAuthChecker: new AccessPermissionsEntityAuthCheck(),
            mapper: mapperService.mapper
        });
    }

    protected generateValidQueryConditionsForCacheClear(entity: AccessPermissions): object[] {
        return [{ id: entity._id, userId: entity.userId }];
    }

}