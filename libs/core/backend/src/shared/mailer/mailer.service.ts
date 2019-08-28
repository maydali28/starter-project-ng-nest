import { Inject, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as Email from 'email-templates';
import { AppConfigProviderTokens } from '../../configuration';
import { ICoreConfig } from '../../configuration/core.config';
import { AppError } from '../exceptions/app.exception';
import { IEmailParams } from './Interfaces/IEmailParams';
import * as path from 'path';

@Injectable()
export class MailerService {
  private readonly relativePaths = {
    emailTemplates: '../../../../email-templates/'
  };

  private readonly absolutePaths = {
    emailTemplates: ''
  };

  constructor(
    @Inject(AppConfigProviderTokens.Config.App)
    private readonly config: ICoreConfig
  ) {
    this.absolutePaths.emailTemplates = path.resolve(
      __dirname,
      this.relativePaths.emailTemplates
    );
  }

  async send(reciever: string, emailParams: IEmailParams): Promise<any> {
    const transporter = await nodemailer.createTransport(this.config.mailer);
    return transporter.verify((error, success) => {
      if (error) {
        throw new AppError(error.message);
      } else {
        const sender = `"${this.config.orgName}" <${
          this.config.mailer.auth.user
        }>`;

        const email = this.initEmail(transporter, sender, reciever);

        return this.send_email(email, sender, reciever, emailParams);
      }
    });
  }

  private initEmail(
    transporter: any,
    sender: string,
    reciever: string,
    send: boolean = true,
    preview: boolean = false
  ): Email {
    return new Email({
      transport: transporter,
      send: send,
      preview: preview,
      message: {
        from: sender,
        to: reciever
      },
      views: {
        options: {
          extension: 'ejs' // <---- HERE
        }
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(this.absolutePaths.emailTemplates, 'assets')
          // images: true,
        }
      }
    });
  }

  private send_email(
    email: Email,
    sender: string,
    reciever: string,
    emailParams: IEmailParams
  ): Promise<any> {
    return email.send({
      template: path.resolve(
        this.absolutePaths.emailTemplates,
        emailParams.view
      ),
      message: {
        from: sender,
        to: reciever
      },
      locals: emailParams.locals
    });
  }
}
