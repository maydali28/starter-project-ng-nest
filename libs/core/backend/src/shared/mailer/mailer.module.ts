import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { ConfigurationModule } from '../../configuration/configuration.module';

@Module({
    imports: [ConfigurationModule],
    providers: [MailerService],
    exports: [MailerService]
})
export class MailerSharedModule { }
