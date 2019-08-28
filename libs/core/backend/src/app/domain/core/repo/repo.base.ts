import { LoggerSharedService } from '../../../../shared/logging/logger.shared.service';
import { CacheStore } from '../../../../shared/caching/cache-store.shared';
import { CrudOperations } from '../../../../shared/authchecks/crud-operations.enum';
import 'automapper-ts/dist/automapper';
import { InstanceType, ModelType, Typegoose } from 'typegoose';
import { AuthCheckContract } from '../../../../shared/authchecks/authcheck.contract';
import { ScopedEntityAuthCheck } from '../../../../shared/authchecks/scoped-entity.authcheck';
import { ClassValidator } from '../validation/validation';
import { AccessPermissionsContract } from '@starter-project-ng-nest/core/global-contracts';
import { AppError } from '../../../../shared/exceptions/app.exception';
import { CachingUtils } from '../../../../shared/caching/caching.utils';
import { Types } from 'mongoose';

export interface IBaseRepoParams<T extends Typegoose> {
  loggerService: LoggerSharedService;
  model: ModelType<T>;
  cacheStore: CacheStore;
  defaultTTL: number;
  entityValidator: ClassValidator<T>;
  entityAuthChecker?: AuthCheckContract<T, CrudOperations>;
  mapper: AutoMapperJs.AutoMapper;
}

export abstract class BaseService<T extends Typegoose> {
  protected _mapper: AutoMapperJs.AutoMapper;

  protected readonly loggerService: LoggerSharedService;
  protected readonly _model: ModelType<T>;
  protected readonly cacheStore: CacheStore;
  protected readonly defaultTTL: number;
  public readonly entityValidator: ClassValidator<T>;
  public readonly entityAuthChecker: AuthCheckContract<T, CrudOperations>;

  constructor(params: IBaseRepoParams<T>) {
    this.loggerService = params.loggerService;
    this._model = params.model;
    this.cacheStore = params.cacheStore;
    this.defaultTTL = params.defaultTTL;
    this.entityValidator = params.entityValidator;
    this.entityAuthChecker =
      params.entityAuthChecker || new ScopedEntityAuthCheck();
    this._mapper = params.mapper;
  }

  private get modelName(): string {
    return this._model.modelName;
  }

  private get viewModelName(): string {
    return `${this._model.modelName}Vm`;
  }

  async map<K>(
    object: Partial<InstanceType<T>> | Array<Partial<InstanceType<T>>>,
    sourceKey: string = this.modelName,
    destinationKey: string = this.viewModelName
  ): Promise<K> {
    return this._mapper.map(sourceKey, destinationKey, object);
  }

  async findById(
    id: string,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T>> {
    const result = await this.tryFindById(id, options);

    // validate not null
    if (!result)
      throw new AppError(
        `Could not find entity ${this.modelName} with id ${id}`,
        options
      );

    // Return
    return result;
  }

  public async tryFindById(
    id: string,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T> | null> {
    // debug logging
    this.loggerService.debug(`${this.modelName}.findOneById`, id, options);

    // Setup
    let key: string | undefined;
    let result: InstanceType<T> | null;
    let cachedResult: InstanceType<T> | null | undefined;

    options = options || {}; // ensure options is not null

    // cache access
    if (!options.skipCache === true) {
      key = CachingUtils.makeCacheKeyFromId(id);
      cachedResult = await this.cacheStore.get(key);
    }

    if (cachedResult) {
      result = cachedResult;
    } else {
      // data store access
      result = await this._dbFindById(id);
    }

    // cache population
    if (!options.skipCache === true && result && !cachedResult) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, {
        ttl: options.ttl || this.defaultTTL
      });
    }

    // authorization checks
    if (!options.skipAuthorization && result) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.modelName,
        targetResource: result,
        operation: CrudOperations.read
      });
    }

    // Return
    return result;
  }

  async findAll(
    filter = {},
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T>[]> {
    // debug logging
    this.loggerService.debug(`${this.modelName}.find`, filter, options);

    // setup
    let key: string | undefined;
    let result: InstanceType<T>[] | null;
    let cachedResult: InstanceType<T>[] | null | undefined;
    options = options || {}; // ensure options is not null

    // cache access
    /* if (!options.skipCache === true) {
             key = CachingUtils.makeCacheKeyFromObject(filter);
             cachedResult = await this.cacheStore.get(key);
         } */

    if (cachedResult) {
      result = cachedResult;
    } else {
      // data store access
      result = await this._dbFind(filter);
    }

    // cache population
    if (!options.skipCache === true && result && !cachedResult) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, {
        ttl: options.ttl || this.defaultTTL
      });
    }

    // authorization checks
    if (!options.skipAuthorization && result) {
      for (const entity of result) {
        if (!options.skipAuthorization) {
          await this.entityAuthChecker.ensureAuthorized({
            accessPermissions: options.accessPermissions,
            origin: this.modelName,
            targetResource: entity,
            operation: CrudOperations.read
          });
        }
      }
    }

    // return
    return result;
  }

  async findOne(
    filter = {},
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T> | null> {
    // validate not null
    const result = this.tryFindOne({ ...filter, isDeleted: false }, options);

    if (!result)
      throw new AppError(
        `Could not find entity ${
          this.modelName
        } with conditions ${JSON.stringify(filter)}`,
        options
      );

    return result;
  }

  public async tryFindOne(
    conditions: object,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T> | null> {
    // debug logging
    this.loggerService.debug(`${this.modelName}.findOne`, conditions, options);

    // Setup
    let key: string | undefined;
    let result: InstanceType<T> | null;
    let cachedResult: InstanceType<T> | null | undefined;

    options = options || {}; // ensure options is not null

    // cache access
    if (!options.skipCache === true) {
      key = CachingUtils.makeCacheKeyFromObject(conditions);
      cachedResult = await this.cacheStore.get(key);
    }

    if (cachedResult) {
      result = cachedResult;
    } else {
      // data store access
      result = await this._dbFindOne(conditions);
    }

    // cache population
    if (!options.skipCache === true && result && !cachedResult) {
      // tslint:disable-next-line:no-non-null-assertion
      this.cacheStore.set(key!, result, {
        ttl: options.ttl || this.defaultTTL
      });
    }

    // authorization checks
    if (!options.skipAuthorization && result) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.modelName,
        targetResource: result,
        operation: CrudOperations.read
      });
    }

    // Return
    return result;
  }

  async findBycode(
    code: string,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T>> {
    // validate not null
    const result = await this.tryFindOne(
      {
        ...this.toObjectcode(code),
        isDeleted: false
      },
      options
    );

    if (!result)
      throw new AppError(
        `Could not find entity ${this.modelName} with code ${JSON.stringify(
          code
        )}`,
        options
      );
    return result;
  }

  async create(
    item: InstanceType<T>,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      customValidator?: ClassValidator<InstanceType<T>>;
    }
  ): Promise<InstanceType<T>> {
    // debug logging
    this.loggerService.debug(`${this.modelName}.create`, item, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    validator.validate(item);

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.modelName,
        targetResource: item,
        operation: CrudOperations.create
      });
    }

    // transfer values to the model
    const createModel: InstanceType<T> = new this._model();
    Object.assign(createModel, item);

    // persist
    return this._dbSave(createModel);
  }

  async update(
    item: InstanceType<T>,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      customValidator?: ClassValidator<InstanceType<T>>;
    }
  ): Promise<InstanceType<T>> {
    // debug logging
    this.loggerService.debug(`${this.modelName}.update`, item, options);

    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(item, { skipMissingProperties: false });

    // authorization checks
    if (!options.skipAuthorization) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.modelName,
        targetResource: item,
        operation: CrudOperations.update
      });
    }

    // persist
    const savedReplacedModel = await this._dbFindOneAndReplace(item);

    // clear cache
    this.clearCacheByEntity(savedReplacedModel);

    return savedReplacedModel;
  }

  async deletePermanently(
    id: string,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
    }
  ): Promise<InstanceType<T>> {
    // debug logging
    this.loggerService.debug(`${this.modelName}.delete`, id, options);

    // setup
    let deletedEntity;
    options = options || {}; // ensure options is not null

    // retrieve
    const deleteModel = await this._dbFindById(id);
    if (!deleteModel)
      throw new AppError(`No ${this.modelName} found with id ${id}`);

    // authorization checks
    if (!options.skipAuthorization && deleteModel) {
      await this.entityAuthChecker.ensureAuthorized({
        accessPermissions: options.accessPermissions,
        origin: this.modelName,
        targetResource: deleteModel,
        operation: CrudOperations.delete
      });
    }

    if (deleteModel) {
      // persist deletion
      deletedEntity = await this._dbRemove(deleteModel);

      // clear cache
      this.clearCacheByEntity(deletedEntity);
    }

    return deletedEntity;
  }

  async archive(
    code: string,
    options?: {
      accessPermissions?: AccessPermissionsContract;
      skipAuthorization?: boolean;
      skipCache?: boolean;
      ttl?: number;
    }
  ): Promise<InstanceType<T> | null> {
    return this._model
      .findOneAndUpdate(
        this.toObjectcode(code),
        { isDeleted: true },
        { new: true }
      )
      .exec();
  }

  // async clearCollection(filter = {}): Promise<any> {
  // return this._model.updateMany({ ...filter, isDeleted: true }, {}, {}).exec();
  // }
  //
  // async clearCollectionPermanetly(filter = {}): Promise<any> {
  // return this._model.deleteMany({ ...filter, isDeleted: true }).exec();
  // }

  protected async clearCacheByEntity(
    entity: InstanceType<T>,
    options?: { customValidator?: ClassValidator<InstanceType<T>> }
  ) {
    // setup
    options = options || {}; // ensure options is not null
    const validator = options.customValidator || this.entityValidator;

    // validation
    await validator.validate(entity);

    // clear by ID
    this.clearCacheByKey(CachingUtils.makeCacheKeyFromId(entity.id));

    // clear by query conditions
    this.generateValidQueryConditionsForCacheClear(entity).forEach(
      cacheClearEntity => {
        this.clearCacheByKey(
          CachingUtils.makeCacheKeyFromObject(cacheClearEntity)
        );
      }
    );
  }

  protected clearCacheByKey(cacheKey: string) {
    if (cacheKey.trim.length > 0)
      throw new AppError('cacheKey can not be null or whitespace');
    return this.cacheStore.del(cacheKey);
  }

  protected abstract generateValidQueryConditionsForCacheClear(
    entity: T
  ): object[];

  private toObjectcode(code: string): object {
    return { code };
  }

  private toObjectId(id: string): Types.ObjectId {
    return Types.ObjectId(id);
  }

  public createObject(clazz: object): InstanceType<T> {
    const object = new this._model(clazz);
    return object;
  }

  //
  // Abstracted Mongoose calls, to allow for easier testing through mocked mongoose calls
  //
  protected async _dbFind(conditions: object): Promise<Array<InstanceType<T>>> {
    this.loggerService.debug(`${this.modelName}._dbFind`, conditions);
    return this._model
      .find(conditions)
      .sort({ updatedAt: -1 })
      .exec();
  }

  protected async _dbSave(
    createModel: InstanceType<T>
  ): Promise<InstanceType<T>> {
    this.loggerService.debug(`${this.modelName}._dbSave`, createModel);
    return createModel.save();
  }

  protected async _dbRemove(
    deleteModel: InstanceType<T>
  ): Promise<InstanceType<T>> {
    this.loggerService.debug(`${this.modelName}._dbRemove`, deleteModel);
    return deleteModel.remove();
  }

  protected async _dbFindById(id: string): Promise<InstanceType<T> | null> {
    this.loggerService.debug(`${this.modelName}._dbFindById`, id);
    return this._model.findById(this.toObjectId(id)).exec();
  }

  protected async _dbFindOneAndReplace(entity: Partial<InstanceType<T>>) {
    this.loggerService.debug(`${this.modelName}._dbFindOneAndReplace`, entity);
    const result = await this._model.collection.findOneAndReplace(
      { _id: entity.id },
      entity,
      { returnOriginal: false }
    );
    return result.value;
  }

  protected async _dbFindOne(conditions: object) {
    this.loggerService.debug(`${this.modelName}._dbFindOne`, conditions);
    const result = await this._model.findOne(conditions).exec();
    return result;
  }
}
