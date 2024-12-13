import { NestFactory } from '@nestjs/core';
import { ServiceAccount } from 'firebase-admin';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
bootstrap();
