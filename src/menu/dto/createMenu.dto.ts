import { IsArray, ValidateNested, Validate, IsISO8601, IsNotEmpty, IsDate, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { MenuPlatoDto } from './menuPlato.dto';
import { UniquePlatoNombreConstraint } from '../validatorMenu/array-not-duplicates.validator';


export class CreateMenuDto {
  @IsNotEmpty({message:"Tiene que tener fecha"})
  @Type(() => Date)
  @IsDate({message:"Tiene que ser una fecha valida"})
  fecha: Date;

  @IsArray()
  @ArrayNotEmpty({message:"No puedes pasar un menu vacio"})
  @Validate(UniquePlatoNombreConstraint)
  @ValidateNested({ each: true })
  @Type(() => MenuPlatoDto)
  menuPlatos: MenuPlatoDto[];
}
