import { IsString, Length, IsOptional, IsNotEmpty, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateUserDto {
  @IsInt({ message: 'El id del departamento debe ser un número entero' })
  @Min(1, { message: 'El id del departamento debe ser válido' })
  @IsOptional()
  @Type(() => Number)
  departamentoId: number;

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
