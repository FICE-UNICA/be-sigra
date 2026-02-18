import { Type } from "class-transformer";
import { IsIn, IsInt, IsNotEmpty, Min } from "class-validator";


export class ReservaPlatoDto {
    @IsNotEmpty({ message: 'El id de la opción es obligatorio.' })
    @IsInt({ message: 'Debe ser un id válido' })
    @Min(1, { message: 'El id de la opción debe ser válido' })
    @Type(() => Number)
    opcionId: number;

    @IsNotEmpty({ message: 'La cantidad de cada plato es obligatoria.' })
    @IsInt({ message: 'La cantidad debe ser un número entero.' })
    @IsIn([0, 1, 2], { message: 'La cantidad solo puede ser 0 o 1 o 2.' })
    cantidad: number;
}