import { Type } from 'class-transformer';
import {IsNotEmpty, IsString, IsNumber, Min, Validate,} from 'class-validator';
import { UniquePlatoNameConstraint } from '../validatorPlato/uniqueNomPlato.validator';

export class CreatePlatoDto {
  @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
  @IsString({ message: 'El nombre debe ser un texto.' })
  @Validate(UniquePlatoNameConstraint, {
    message: 'Ya existe un plato con ese nombre.',
  })
  nombre: string;

  @IsNotEmpty({ message: 'La descripción del plato es obligatoria.' })
  @IsString({ message: 'La descripción debe ser un texto.' })
  descripcion: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número válido.' })
  @Min(1, { message: 'El precio debe ser al menos 1.' })
  precio: number;
}
