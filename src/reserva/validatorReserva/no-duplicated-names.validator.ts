import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments
  } from 'class-validator';
  
  @ValidatorConstraint({ async: false })
  export class NoDuplicateNamesConstraint implements ValidatorConstraintInterface {
    validate(items: any[], args: ValidationArguments): boolean {
      if (!Array.isArray(items)) return false;
      const normalized = items
        .map(item =>
          typeof item.nombre === 'string'
            ? item.nombre.trim().toLowerCase()
            : null
        )
        .filter(name => name !== null);
      return normalized.length === new Set(normalized).size;
    }
  
    defaultMessage(args: ValidationArguments): string {
      return 'No puede haber dos platos con el mismo nombre.';
    }
  }
  