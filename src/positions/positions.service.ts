import { Injectable } from '@nestjs/common';
import { PositionDto } from './dto/position.dto';

@Injectable()
export class PositionsService {
  private readonly positions: PositionDto[] = [
    {
      id: 1,
      name: 'Lawyer',
    },
    {
      id: 2,
      name: 'Content manager',
    },
    {
      id: 3,
      name: 'Security',
    },
    {
      id: 4,
      name: 'Designer',
    },
  ];

  async getPositions(): Promise<PositionDto[]> {
    return this.positions;
  }

  async getName(id: number): Promise<string | undefined> {
    console.log('getName');
    return this.positions.find((pos) => pos.id === id)?.name ?? undefined;
  }
}
