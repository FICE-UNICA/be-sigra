// src/menu/validators/unique-plato-nombre.validator.ts
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ name: 'UniquePlatoNombre', async: false })
export class UniquePlatoNombreConstraint implements ValidatorConstraintInterface {
  validate(menuPlatos: any[], args: ValidationArguments): boolean {
    if (!Array.isArray(menuPlatos)) return false;

    // Extraemos todos los nombres
    const nombres = menuPlatos.map(plato => plato.nombre);
    // Comprobamos si hay duplicados
    const uniqueNombres = new Set(nombres);

    return uniqueNombres.size === nombres.length;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Hay platos con nombres repetidos en el menú';
  }
}
