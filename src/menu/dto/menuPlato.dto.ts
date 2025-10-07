import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';


export class MenuPlatoDto {
  @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
  @IsString({ message: 'El nombre debe ser un texto.' })
  nombre: string;

  @IsNotEmpty()
  @IsBoolean({message:"Tiene que ser un booleano"})
  elegible: boolean;
}
