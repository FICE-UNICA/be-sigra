import { Type } from 'class-transformer';
import {IsNotEmpty, IsString, IsNumber, Min, Validate,} from 'class-validator';

export class UpdatePlatoDto {
  @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
  @IsString({ message: 'El nombre debe ser un texto.' })
  nombre: string;

  @IsNotEmpty({ message: 'La descripción del plato es obligatoria.' })
  @IsString({ message: 'La descripción debe ser un texto.' })
  descripcion: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'El precio debe ser un número válido.' })
  @Min(1, { message: 'El precio debe ser al menos 1.' })
  precio: number;
}
