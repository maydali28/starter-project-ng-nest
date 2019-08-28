import { Inject } from '@nestjs/common';
import { ICoreConfig } from '../../configuration/core.config';
import { AppConfigProviderTokens } from '../../configuration/index';
import { LogLevels } from './log-levels.const';
import { LoggerSharedService } from './logger.shared.service';

export class LoggerConsoleSharedService implements LoggerSharedService {
  constructor(
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly coreConfig: ICoreConfig,
  ) { }
  private endSeparator = '\n\n---------------';

  private logError: boolean = this.coreConfig.logging.console.levels.includes(LogLevels.error);
  private logWarn: boolean = this.coreConfig.logging.console.levels.includes(LogLevels.warning);
  private logInfo: boolean = this.coreConfig.logging.console.levels.includes(LogLevels.info);
  private logDebug: boolean = this.coreConfig.logging.console.levels.includes(LogLevels.debug);
  private logTrace: boolean = this.coreConfig.logging.console.levels.includes(LogLevels.trace);

  public async log(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logInfo) console.log(msg, ...logObjects, this.endSeparator);
    // tslint:disable-next-line:no-console
    // console.trace();
  }

  public async info(msg: string, ...logObjects: any[]) {
    if (this.logInfo) {
      // tslint:disable-next-line:no-console
      console.info(msg, ...logObjects, this.endSeparator);
    }
  }

  public async error(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logError) {
      console.error(msg, ...logObjects, this.endSeparator);
      // tslint:disable-next-line:no-console
      console.trace();
    }
  }

  public async warn(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logWarn) console.warn(msg, ...logObjects, this.endSeparator);
  }

  public async debug(msg: string, ...logObjects: any[]) {
    if (this.logDebug) {
      // tslint:disable-next-line:no-console
      console.debug(msg, ...logObjects, this.endSeparator);
    }
    // tslint:disable-next-line:no-console
    // console.trace();
  }

  public async trace(msg: string, ...logObjects: any[]) {
    // tslint:disable-next-line:no-console
    if (this.logTrace) console.log(msg, ...logObjects, this.endSeparator);
  }
}
