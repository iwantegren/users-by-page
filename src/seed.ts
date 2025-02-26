import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.create(SeedModule);
  const seedService = app.get(SeedService);

  await seedService.seedPositions();
  await seedService.seedUsers(45);

  await app.close();
}

bootstrap();
