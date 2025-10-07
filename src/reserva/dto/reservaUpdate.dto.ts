import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsDate, IsNotEmpty, Validate, ValidateNested } from "class-validator";
import { ReservaPlatoDto } from "./reservaPlato.dto";
import { NoDuplicateNamesConstraint } from "../validatorReserva/no-duplicated-names.validator";


export class UpdateReservaDto {
    @IsNotEmpty({message:"Tiene que tener fecha"})
    @Type(() => Date)
    @IsDate({message:"Tiene que ser una fecha valida"})
    fecha: Date;  
    
    @IsArray()
    @ArrayNotEmpty({message:"No puedes pasar una reserva vacia"})
    @Validate(NoDuplicateNamesConstraint)
    @ValidateNested({ each: true })
    @Type(() => ReservaPlatoDto)
    reservaPlatos: ReservaPlatoDto[];     
}