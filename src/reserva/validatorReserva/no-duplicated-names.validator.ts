import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class NoDuplicateOptionIdConstraint implements ValidatorConstraintInterface {

  validate(items: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(items)) return false;

    const ids = items
      .map(item =>
        typeof item.opcionId === 'number' || typeof item.opcionId === 'string'
          ? item.opcionId
          : null
      )
      .filter(id => id !== null);

    return ids.length === new Set(ids).size;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'No puede repetir ningún plato';
  }
}

  