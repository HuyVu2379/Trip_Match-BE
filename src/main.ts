import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with permissive settings for development
  app.enableCors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With', 'Origin'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 8080;
  await app.listen(port);
  console.log(`Application is running on port: ${port}`);
  console.log(`CORS is enabled for all origins`);
}
bootstrap();
