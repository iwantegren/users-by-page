import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedKeyGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const seedKey = request.headers['seed-key'];

    if (seedKey && seedKey === this.configService.get<string>('SEED_KEY')) {
      return true;
    }

    return false;
  }
}
