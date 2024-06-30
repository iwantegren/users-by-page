import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  const args = process.argv.slice(2);
  const baseUrl = args[0];

  if (!baseUrl) {
    console.error('Error: Base URL is required as the first argument.');
    process.exit(1);
  }

  const app = await NestFactory.create(SeedModule);
  const seedService = app.get(SeedService);

  await seedService.seedPositions();
  await seedService.seedUsers(baseUrl);

  await app.close();
}

bootstrap();
