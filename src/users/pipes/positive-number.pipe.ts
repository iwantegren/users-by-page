import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform<number> {
  transform(value: number, metadata: ArgumentMetadata) {
    if (value < 1) {
      throw new BadRequestException(
        `${metadata.data} ${value} should be positive integer number`,
      );
    }

    return value;
  }
}
