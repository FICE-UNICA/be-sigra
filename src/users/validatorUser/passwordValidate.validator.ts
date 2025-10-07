import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';

@ValidatorConstraint({ name: 'PasswordStrength', async: false })
@Injectable()
export class PasswordStrengthConstraint
  implements ValidatorConstraintInterface
{
  validate(password: string, args: ValidationArguments) {
    if (typeof password !== 'string') return false;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    return hasUpperCase && hasNumber;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La contraseña debe contener al menos una mayúscula y al menos un número.';
  }
}
