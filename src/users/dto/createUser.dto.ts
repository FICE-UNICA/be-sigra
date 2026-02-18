import { IsString, Length, MinLength, IsEnum, IsNotEmpty, Validate, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { UniqueUsernameConstraint } from '../validatorUser/uniqueUsername.validator';
import { PasswordStrengthConstraint } from '../validatorUser/passwordValidate.validator';

export enum UserRole {
  ADMIN = 'ADMIN',
  USUARIO = 'USUARIO',
}

export class CreateUserDto {
  @IsInt({ message: 'El id del departamento debe ser un número entero' })
  @Min(1, { message: 'El id del departamento debe ser válido' })
  @IsNotEmpty({ message: 'El departamento es obligatorio' })
  @Type(() => Number)
  departamentoId: number;

  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El campo nombre es obligatorio' })
  nombre: string;

  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El campo apellido paterno es obligatorio' })
  apellidoPat: string;

  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El campo apellido materno es obligatorio' })
  apellidoMat: string;

  @IsString()
  @Length(3, 20, { message: 'El usuario tiene que estar entre los 3 y 20 caracteres' })
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  @Validate(UniqueUsernameConstraint)
  username: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña tiene que tener al menos 8 caracteres' })
  @IsNotEmpty({ message: 'El campo contraseña es obligatorio' })
  @Validate(PasswordStrengthConstraint)
  password: string;

  @IsEnum(UserRole, { message: 'El rol tiene que ser ADMIN o USUARIO' })
  @IsNotEmpty({ message: 'El campo rol es obligatorio' })
  role: UserRole;
}
