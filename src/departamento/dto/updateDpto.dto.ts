import {IsString, Length, IsNotEmpty, IsOptional, Validate} from 'class-validator';
import { UniqueDepartamentoNameConstraint } from '../validatorDpto/uniqueNombre.validator';

export class UpdateDptoDto {
    @IsOptional()
    @IsString()
    @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
    @IsNotEmpty({ message: 'El nombre de departamento es obligatorio' })
    nombre?: string;
}