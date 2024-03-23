import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'modules/app.module';
import { ConfigService } from '@nestjs/config';

import * as admin from 'firebase-admin';
import { ServiceAccount } from 'firebase-admin';
import { Logger } from '@nestjs/common';

async function start() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const configService: ConfigService = app.get(ConfigService);

  const adminConfig: ServiceAccount = {
    projectId: configService.get<string>('FIREBASE_STORAGE_PROJECT_ID'),
    privateKey: (
      configService.get<string>('FIREBASE_STORAGE_PRIVATE_KEY') || ''
    ).replace(/\\\\n/g, '\\n'),
    clientEmail: configService.get<string>('FIREBASE_STORAGE_CLIENT_EMAIL'),
  };
  admin.initializeApp({
    credential: admin.credential.cert(adminConfig),
    storageBucket: configService.get<string>('FIREBASE_STORAGE_BUCKET'),
  });

  const PORT = configService.get<number>('PORT') || 5000;

  const swaggerConfig = new DocumentBuilder()
    .setTitle('"URA REMONT" SERVER')
    .addBearerAuth({
      type: 'http',
    })
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () =>
    Logger.warn(`Server started on port = ${PORT}`, 'NestApplication'),
  );
}
start();
