import { IsArray, ValidateNested, IsNotEmpty, IsDate, ArrayNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { MenuPlatoDto } from './menuPlato.dto';

export class UpdateMenuDto {
  @IsNotEmpty({message:"Tiene que tener fecha"})
  @Type(() => Date)
  @IsDate({message:"Tiene que ser una fecha valida"})
  fecha: Date;


  @IsArray()
  @ArrayNotEmpty({message:"No puedes pasar un menu vacio"})
  @ValidateNested({ each: true })
  @Type(() => MenuPlatoDto)
  menuPlatos: MenuPlatoDto[];
}
