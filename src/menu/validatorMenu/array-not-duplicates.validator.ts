// src/menu/validators/unique-plato-nombre.validator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'UniquePlatoId', async: false })
export class UniquePlatoNombreConstraint implements ValidatorConstraintInterface {
  validate(menuPlatos: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(menuPlatos)) return false;

    const ids = menuPlatos.map(plato => plato.platoId);
    const uniqueIds = new Set(ids);

    return uniqueIds.size === ids.length;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Hay platos duplicados en el menú';
  }
}
