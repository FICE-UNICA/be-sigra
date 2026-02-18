import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, Min } from 'class-validator';


export class MenuPlatoDto {
  @IsNotEmpty({ message: 'El nombre del plato es obligatorio.' })
  @IsInt({ message: 'Debe ser un id válido' })
  @Min(1, { message: 'El id del plato debe ser válido' })
  @Type(() => Number)
  platoId: number;

  @IsNotEmpty()
  @IsBoolean({message:"Tiene que ser un booleano"})
  elegible: boolean;
}
