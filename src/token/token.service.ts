import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { TokenStorageService } from './token-storage.service';

@Injectable()
export class TokenService {
  private readonly TOKEN_LENGTH = 220;
  constructor(private readonly storage: TokenStorageService) {}

  private async generate(): Promise<string> {
    return randomBytes(this.TOKEN_LENGTH).toString('base64');
  }

  async create(): Promise<string> {
    let token: string;
    let exists = true;
    while (exists) {
      token = await this.generate();
      exists = await this.storage.exists(token);
    }

    this.storage.push(token);
    return token;
  }

  async invalidate(token: string): Promise<boolean> {
    return await this.storage.pop(token);
  }
}
