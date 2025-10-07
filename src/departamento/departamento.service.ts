import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateDptoDto } from './dto/createDpto.dto';
import { UpdateDptoDto } from './dto/updateDpto.dto';
import { Departamento } from '@prisma/client';

@Injectable()
export class DepartamentoService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(){
    return this.prisma.departamento.findMany({
      select:{
        id: true,
        nombre:true
      }
    })
  }

  async findOne(id: number){
    const departamento = await this.prisma.departamento.findUnique({
      where: { id },
      select:{
        id: true,
        nombre:true
      }
    });
    if (!departamento) {
      throw new NotFoundException(`Departamento no encontrado`);
    }
    return departamento;
  }

  async create(createDptoDto: CreateDptoDto): Promise<{message:string}> {
    await this.prisma.departamento.create({
      data: createDptoDto,
    });

    return {message:"Despartamento creado satisfactoriamente"}
  }

  async update(id: number, updateDptoDto: UpdateDptoDto): Promise<{message:string}> {
    await this.findOne(id);

    if (updateDptoDto.nombre) {
      const duplicado = await this.prisma.departamento.findFirst({
        where: {
          nombre: updateDptoDto.nombre,
          NOT: { id },         
        },
      });

      if (duplicado) {
        throw new ConflictException(
          `El nombre de departamento '${updateDptoDto.nombre}' ya está en uso.`
        );
      }
    }
    await this.prisma.departamento.update({
      where: { id },
      data: updateDptoDto,
    });

    return {message:"Despartamento editado satisfactoriamente"}
  }

  async remove(id: number): Promise<{message:string}> {
    await this.findOne(id);

    await this.prisma.departamento.delete({ 
      where: { id } 
    });

    return {message:"Despartamento eliminado satisfactoriamente"}
  }
}
