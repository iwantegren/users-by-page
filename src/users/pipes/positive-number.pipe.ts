import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class PositiveNumberPipe implements PipeTransform<any> {
  constructor(private readonly defaultValue: number) {}

  static withValue(defaultValue: number): PipeTransform {
    return new PositiveNumberPipe(defaultValue);
  }

  transform(value: number, metadata: ArgumentMetadata) {
    if (value === undefined || Number.isNaN(value)) {
      if (this.defaultValue === undefined)
        throw new BadRequestException(`${metadata.data} is required`);

      return this.defaultValue;
    }

    if (!Number.isInteger(value) || value < 1) {
      throw new BadRequestException(
        `${metadata.data} ${value} should be positive integer number`,
      );
    }

    return value;
  }
}
