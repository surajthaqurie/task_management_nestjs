import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { UserModule } from './user/user.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api/v1');

  const options = new DocumentBuilder()
    .setTitle(process.env.APP_NAME!)
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const apiDocument = SwaggerModule.createDocument(app, options, {
    include: [UserModule],
  });
  SwaggerModule.setup('/api', app, apiDocument);

  const PORT = process.env.PORT || 4001;
  await app.listen(PORT);

  console.log(`APP IS LISTENING TO PORT ${PORT}`);
  console.log(`Swagger document ${process.env.APP_URL}`);
}
bootstrap();
