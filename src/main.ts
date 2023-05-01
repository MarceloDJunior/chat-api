import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@/app.module';
import { config } from './config/configutation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // This option ensures default values are applied to our DTOs
    }),
  );

  const documentoConfig = new DocumentBuilder()
    .setTitle('Chat API')
    .setDescription('Chat API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, documentoConfig);
  SwaggerModule.setup('api', app, document);

  let corsOptions;
  if (!config.isDev) {
    corsOptions = {
      origin: ['https://chat-api.link'],
      methods: ['GET', 'POST', 'UPDATE', 'OPTIONS'],
      credentials: true,
    };
  }

  app.enableCors(corsOptions);

  const hostname = config.isDev ? '127.0.0.1' : '0.0.0.0';
  await app.listen(3000, hostname);
}
bootstrap();
