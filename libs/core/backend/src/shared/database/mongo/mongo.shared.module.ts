import { Module, DynamicModule } from '@nestjs/common';
import { ICoreConfig } from '../../../configuration/core.config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({

})
export class MongoSharedModule {
    public static forRoot(_coreConfig: ICoreConfig): DynamicModule {
        return {
            module: MongoSharedModule,
            imports: [
                MongooseModule.forRoot(_coreConfig.db.mongo.mongoConnectionUri, _coreConfig.db.mongo.options),
            ],
        };
    }
}