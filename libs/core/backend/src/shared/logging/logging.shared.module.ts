import { Module } from '@nestjs/common';
import { CoreConfig } from '../../configuration/core.config';
import { LoggerConsoleSharedService } from './console-logger.shared.service';
import { LoggerWinstonSharedService } from './logger-winston.shared.service';
import { LoggerSharedService } from './logger.shared.service';

export const getLogger = (): LoggerSharedService => {
  return CoreConfig.nodeEnv === 'prod'
    ? new LoggerWinstonSharedService(CoreConfig)
    : new LoggerConsoleSharedService(CoreConfig);
};

const LoggerSharedServiceProvider = {
  provide: LoggerSharedService,
  useFactory: getLogger,
};

@Module({
  imports: [],
  providers: [LoggerSharedServiceProvider],
  exports: [LoggerSharedServiceProvider],
})
export class LoggingSharedModule { }
