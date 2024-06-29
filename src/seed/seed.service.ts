import { HttpException, Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { PositionsService } from 'src/positions/positions.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly positionsService: PositionsService) {}

  async seedPositions() {
    const filePath = path.join(__dirname, 'positions.txt');
    const positions = fs.readFileSync(filePath, 'utf-8').split('\n');

    for (const position of positions) {
      if (position.trim()) {
        try {
          await this.positionsService.addPosition(position.trim());
        } catch (err) {
          if (err instanceof HttpException) {
            this.logger.warn(err);
          } else {
            this.logger.error(
              `Unexpected error while seeding positions: ${err}`,
            );
          }
        }
      }
    }
  }
}
