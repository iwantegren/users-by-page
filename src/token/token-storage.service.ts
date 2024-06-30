import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class TokenStorageService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;
  private readonly TTL = 40 * 60; // 40 minutes

  constructor() {
    this.client = createClient({
      url: 'redis://localhost:6379',
    });
  }

  async onModuleInit() {
    if (!this.client.isOpen) await this.client.connect();
  }

  async onModuleDestroy() {
    if (this.client.isOpen) await this.client.disconnect();
  }

  async push(token: string): Promise<void> {
    await this.client.set(token, 1, { EX: this.TTL });
  }

  async pop(token: string): Promise<boolean> {
    return (await this.client.del(token)) === 1;
  }

  async exists(token: string): Promise<boolean> {
    return (await this.client.exists(token)) === 1;
  }
}
