import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.enableCors({
    origin: '*',
    allowedHeaders: ['Authorization', 'Content-Type'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  });
  app.setGlobalPrefix('/api/v1');
  await app.listen(Number.parseInt(process.env.APP_PORT));
}
bootstrap();
