import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { LogLevel } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  app.set('trust proxy', 1);
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const logLevels = configService.get<string>('NEST_LOG_LEVELS')?.split(',');
  if (logLevels) app.useLogger(logLevels as LogLevel[]);

  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
