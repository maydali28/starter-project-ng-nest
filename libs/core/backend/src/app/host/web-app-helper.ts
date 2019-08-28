import { INestApplication } from '@nestjs/common';
import { ICoreConfig } from '../../configuration/core.config';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

export class WebAppHelper {
  public static async setupCoreApp(
    coreConfig: ICoreConfig,
    app: INestApplication & NestExpressApplication,
  ) {
    // RUN SETUP STEPS

    const swaggerOptions = new DocumentBuilder()
      .setTitle('Nest MEAN')
      .setDescription('API Documentation')
      .setVersion('1.0.0')
      .setHost(coreConfig.http.rootUrl)
      .setSchemes(coreConfig.http.protocol)
      .setBasePath('/api')
      .addBearerAuth('Authorization', 'header')
      .build();

    const swaggerDoc = SwaggerModule.createDocument(app, swaggerOptions);

    SwaggerModule.setup('/api/docs', app, swaggerDoc, {
      swaggerUrl: `${coreConfig.http.rootUrl}/api/docs-json`,
      explorer: true,
      swaggerOptions: {
        docExpansion: 'list',
        filter: true,
        showRequestDuration: true,
      },
    });

    /*    logger.debug(`AppConfig.migrations.autoRun: ${nestBffConfig.migrations.autoRun}`);
    if (nestBffConfig.migrations.autoRun) await app.get(MigrationsSharedService).autoRunMigrations(nestBffConfig.nodeEnv);
  */
  }
}