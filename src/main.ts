import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'modules';

async function start() {
  const PORT = Number(process.env.PORT || 5000);
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  app.useGlobalPipes(new ValidationPipe());
  const config = new DocumentBuilder()
    .setTitle('"URA REMONT" SERVER')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`));
}
start();
