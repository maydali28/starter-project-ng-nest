import { Module } from '@nestjs/common';
import { AppConfigProviderTokens } from './index';

const CoreConfigProvider = {
    provide: AppConfigProviderTokens.Config.App,
    useFactory: () => {
        // @ts-ignore
        return global.core.config;
    },
};

@Module({
    imports: [],
    providers: [CoreConfigProvider],
    exports: [CoreConfigProvider],
})
export class ConfigurationModule { }