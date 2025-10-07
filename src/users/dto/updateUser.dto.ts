import { IsString, Length, IsOptional, IsNotEmpty, Validate,} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El nombre de departamento es obligatorio' })
  departamento: string;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El campo apellido paterno es obligatorio' })
  nombre?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El campo apellido paterno es obligatorio' })
  apellidoPat?: string;

  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
  @IsNotEmpty({ message: 'El campo apellido materno es obligatorio' })
  apellidoMat?: string;

  @IsOptional()
  @IsString()
  @Length(3, 20, { message: 'El usuario tiene que estar entre los 3 y 20 caracteres' })
  @IsNotEmpty({ message: 'El campo usuario es obligatorio' })
  username?: string;
}
