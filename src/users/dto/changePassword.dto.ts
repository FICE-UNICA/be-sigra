import {
  IsString, MinLength, IsNotEmpty, Validate,
} from 'class-validator';
import { MatchPasswordConstraint } from '../validatorUser/matchPassword.validator';
import { PasswordStrengthConstraint } from '../validatorUser/passwordValidate.validator';

export class ChangePasswordDto {
  @IsString()
  @MinLength(8, { message: 'La contraseña tiene que tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'El campo nueva contraseña es obligatorio' })
  @Validate(PasswordStrengthConstraint)
  newPassword: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña tiene que tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'El campo confirmar contraseña es obligatorio' })
  @Validate(MatchPasswordConstraint, ['newPassword'], {
    message: 'Las contraseñas no coinciden',
  })
  confirmNewPassword: string;
}
