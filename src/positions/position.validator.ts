import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { PositionsService } from './positions.service';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ async: true })
@Injectable()
export class IsPositionIdConstraint implements ValidatorConstraintInterface {
  private readonly positionsService: PositionsService;

  constructor() {
    /* This is wrong way to instantiate service inside of class, but I haven't found better solution for it in limited time */
    this.positionsService = new PositionsService();
  }

  async validate(position_id: number, _args: ValidationArguments) {
    const result = await this.positionsService.getName(position_id);
    return result !== undefined;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} value is not a valid position id`;
  }
}

export function IsPositionId(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPositionIdConstraint,
    });
  };
}
