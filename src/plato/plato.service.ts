import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Plato } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';

@Injectable()
export class PlatoService {
    constructor(private readonly prisma:PrismaService){}

      async findAll(){
        return this.prisma.plato.findMany({
          select:{
            id: true,
            nombre:true,
            descripcion:true,
            precio:true
          }
        });
      }
    
      async findOne(id: number){
        const plato = await this.prisma.plato.findUnique({
          where: { id },
          select:{
            id: true,
            nombre:true,
            descripcion:true,
            precio:true
          }
        });
        if (!plato) {
          throw new NotFoundException(`Departamento no encontrado`);
        }
        return plato;
      }
    
      async create(createDptoDto: CreatePlatoDto): Promise<{message: string}> {
        await this.prisma.plato.create({
          data: createDptoDto,
        });

        return {message:"Plato creado satisfactoriamente"}
      }

      async update(id: number, updatePlatoDto: UpdatePlatoDto): Promise<{message: string}> {
          await this.findOne(id);
      
          if (updatePlatoDto.nombre) {
            const duplicado = await this.prisma.plato.findFirst({
              where: {
                nombre: updatePlatoDto.nombre,
                NOT: { id },   
              },
            });
      
            if (duplicado) {
              throw new ConflictException(
                `El nombre de departamento '${updatePlatoDto.nombre}' ya está en uso.`
              );
            }
          }
          await this.prisma.plato.update({
            where: { id },
            data: updatePlatoDto,
          });
          return {message:"Plato editado satisfactoriamente"}
        }

     async remove(id: number): Promise<{message: string}> {
          await this.findOne(id);
      
          await this.prisma.plato.delete({ 
            where: { id } 
          });
          
          return {message:"Plato eliminado satisfactoriamente"}
        }
      
}
