import { NestFactory } from '@nestjs/core';
import { ServiceAccount } from 'firebase-admin';
import * as firebaseServiceAccount from '../firebaseServiceAccount.json';
import * as admin from 'firebase-admin';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const firebaseServiceAccountConfig: ServiceAccount = {
    projectId: firebaseServiceAccount['project_id'],

    privateKey: firebaseServiceAccount['private_key'],

    clientEmail: firebaseServiceAccount['client_email'],
  };
  admin.initializeApp({
    credential: admin.credential.cert(firebaseServiceAccountConfig),
  });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  const PORT = process.env.PORT || 4000;
  await app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}
bootstrap();
