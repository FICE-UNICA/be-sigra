import {IsString, Length, IsNotEmpty, validate, Validate} from 'class-validator';
import { UniqueDepartamentoNameConstraint } from '../validatorDpto/uniqueNombre.validator';

export class CreateDptoDto {
    @IsString()
    @Length(1, 50, { message: 'El nombre tiene que estar entre los 1 y 50 caracteres' })
    @IsNotEmpty({ message: 'El nombre de departamento es obligatorio' })
    @Validate(UniqueDepartamentoNameConstraint)
    nombre: string;
}