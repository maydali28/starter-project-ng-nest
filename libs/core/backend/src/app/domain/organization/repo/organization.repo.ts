import { BaseService } from "../../core/repo/repo.base";
import { Organization } from "../model/organization.model";
import { Injectable, Inject } from "@nestjs/common";
import { LoggerSharedService } from "../../../../shared/logging/logger.shared.service";
import { ModelType } from "typegoose";
import { CacheStore } from "../../../../shared/caching/cache-store.shared";
import { ICoreConfig } from "../../../../configuration/core.config";
import { CachingProviderTokens } from "../../../../shared/caching/caching.shared.constants";
import { AppConfigProviderTokens } from "../../../../configuration";
import { MapperService } from "../../core/mapper/mapper.service";
import { ClassValidator } from "../../core/validation/validation";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class OrganizationRepo extends BaseService<Organization>{

    constructor(readonly loggerService: LoggerSharedService,
        @InjectModel(Organization.modelName) model: ModelType<Organization>,
        @Inject(CachingProviderTokens.Services.CacheStore) cacheStore: CacheStore,
        @Inject(AppConfigProviderTokens.Config.App) coreConfig: ICoreConfig,
        readonly mapperService: MapperService) {
        super({
            loggerService,
            cacheStore,
            defaultTTL: coreConfig.caching.entities.organization,
            entityValidator: new ClassValidator(loggerService, Organization),
            model,
            mapper: mapperService.mapper
        });
    }

    protected generateValidQueryConditionsForCacheClear(entity: Organization): object[] {
        return [{ id: entity._id, slug: entity.slug }];
    }
}