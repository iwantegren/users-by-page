import { Test, TestingModule } from '@nestjs/testing';
import { createClient, RedisClientType } from 'redis';
import TokenStorageService from './token-storage.service';
import { TokenController } from './token.controller';
import TokenService from './token.service';

jest.mock('redis', () => ({
  createClient: jest.fn().mockReturnValue({
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
  }),
}));

describe('TokenStorageService', () => {
  const token = 'test-token';

  let service: TokenStorageService;
  let client: RedisClientType;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenService, TokenStorageService],
      controllers: [TokenController],
    }).compile();

    service = module.get<TokenStorageService>(TokenStorageService);
    client = createClient();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set a token with TTL', async () => {
    await service.push(token);
    expect(client.set).toHaveBeenCalledWith(token, 1, { EX: service['TTL'] });
  });

  it('should delete a token and return true if it exists', async () => {
    (client.del as jest.Mock).mockResolvedValue(1);

    const result = await service.pop(token);
    expect(result).toBe(true);
    expect(client.del).toHaveBeenCalledWith(token);
  });

  it('should return false if the token does not exist on delete', async () => {
    (client.del as jest.Mock).mockResolvedValue(0);

    const result = await service.pop(token);
    expect(result).toBe(false);
    expect(client.del).toHaveBeenCalledWith(token);
  });

  it('should return true if the token exists', async () => {
    (client.exists as jest.Mock).mockResolvedValue(1);

    const result = await service.exists(token);
    expect(result).toBe(true);
    expect(client.exists).toHaveBeenCalledWith(token);
  });

  it('should return false if the token does not exist', async () => {
    (client.exists as jest.Mock).mockResolvedValue(0);

    const result = await service.exists(token);
    expect(result).toBe(false);
    expect(client.exists).toHaveBeenCalledWith(token);
  });
});
