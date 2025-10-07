import { IsIn, IsInt, IsNotEmpty, IsString } from "class-validator";


export class ReservaPlatoDto {
    @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
    @IsString({ message: 'El nombre debe ser un texto.' })
    nombre: string;  

    @IsNotEmpty({ message: 'La cantidad de cada plato es obligatoria.' })
    @IsInt({ message: 'La cantidad debe ser un número entero.' })
    @IsIn([0, 1, 2], { message: 'La cantidad solo puede ser 0 o 1 o 2.' })
    cantidad: number;
}