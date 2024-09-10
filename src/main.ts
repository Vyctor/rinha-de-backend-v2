import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SeedService } from './config/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    bodyParser: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const seed = app.get(SeedService);
  await seed.seedUsers();
  await app.listen(3000);
}
bootstrap();
