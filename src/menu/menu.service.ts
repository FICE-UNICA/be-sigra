import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMenuDto } from './dto/createMenu.dto';
import { UpdateMenuDto } from './dto/updateMenu.dto';
import { Menu } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllMenu(){
    return this.prisma.menu.findMany({
      select:{
        id:true,
        fecha:true
      }
    });
  }

  async getMenuById(id: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id },
      include: {
        menuPlatos: {
          include: { Plato: true },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(`No se encontró el menú con id ${id}`);
    }

    return {
      fecha: menu.fecha,
      publicado: menu.publicado,              
      platos: menu.menuPlatos.map(mp => ({
        nombre: mp.Plato.nombre,
        elegible: mp.elegible,
      })),
    };
  
  }
  
  async findByFecha(fecha: Date){
     const menu = await this.prisma.menu.findUnique({
      where: { fecha },
      include: {
        menuPlatos: {
          include: { Plato: true },
        },
      },
    });

    if (!menu) {
      throw new NotFoundException(
        `No existe menu para la fecha ${fecha.toDateString()}`
      );
    }

    return {
      fecha: menu.fecha,
      publicado: menu.publicado,
      platos: menu.menuPlatos.map(mp => ({
        nombre: mp.Plato.nombre,
        elegible: mp.elegible,
      })),
    };
  }

  async createMenu(dto: CreateMenuDto): Promise<{ message: string }> {
    const { fecha, menuPlatos } = dto;

    const existing = await this.prisma.menu.findUnique({
      where: { fecha },
    });
    if (existing) {
      throw new BadRequestException(
        'Ya existe un menú para la fecha indicada',
      );
    }

    const nombres = menuPlatos.map(mp => mp.nombre);

    const existentes = await this.prisma.plato.findMany({
      where: { nombre: { in: nombres } },
      select: { nombre: true },
    });

    const encontrados = existentes.map(p => p.nombre);
    const faltantes = nombres.filter(n => !encontrados.includes(n));
    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No se encontraron los siguientes platos: ${faltantes.join(', ')}`
      );
    }
    
    const platosData = menuPlatos.map(mp => ({
      elegible: mp.elegible,
      Plato: {
        connect: { nombre: mp.nombre },
      },
    }));

    await this.prisma.menu.create({
      data: {
        fecha,
        menuPlatos: {
          create: platosData,
        },
      },
      include: {
        menuPlatos: {
          include: { Plato: true },
        },
      },
    });

    return {message:"Menu creado satisfactoriamente"};
  }

  async updateMenu(id: number,dto: UpdateMenuDto): Promise<{ message: string }> {
  const { fecha, menuPlatos } = dto;

  const existing = await this.prisma.menu.findUnique({ where: { id }});
  if (!existing) {
    throw new NotFoundException(`No existe un menú con id ${id}`);
  }
  if (existing.publicado) {
    throw new ConflictException(
      'No se puede editar el menú porque ya está publicado'
    );
  }

  const nombres = menuPlatos.map(mp => mp.nombre);

    const existentes = await this.prisma.plato.findMany({
      where: { nombre: { in: nombres } },
      select: { nombre: true },
    });

    const encontrados = existentes.map(p => p.nombre);
    const faltantes = nombres.filter(n => !encontrados.includes(n));
    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No se encontraron los siguientes platos: ${faltantes.join(', ')}`
      );
    }

  const platoIds = menuPlatos.map((mp) => mp.nombre);
  const uniqueIds = new Set(platoIds);
  if (uniqueIds.size !== platoIds.length) {
    throw new BadRequestException(
      'No se permiten platos duplicados en el menú'
    );
  }

  if (dto.fecha.getTime() !== existing.fecha.getTime()) {
    const conflicto = await this.prisma.menu.findUnique({
      where: { fecha: dto.fecha },
    });
    if (conflicto) {
      throw new ConflictException(
        `Ya existe un menú para la fecha ${dto.fecha.toISOString()}`
      );
    }
  }

  await this.prisma.$transaction(async (tx) => {
    await tx.menu.update({
      where: { id },
      data: {
        fecha,
        menuPlatos: {
          deleteMany: {},
          create: menuPlatos.map((mp) => ({
            elegible: mp.elegible,
            Plato: {
              connect: { nombre: mp.nombre },
            },
          })),
        },
      },
    });
  });

  return { message: 'Menú editado satisfactoriamente' };
}


  async publicarMenu(id: number): Promise<{ message: string }>{
    const menu= await this.prisma.menu.findUnique({
       where: { id }
    })

    if (!menu) {
      throw new NotFoundException("No se encontró el menú.");
    }

    if (menu.publicado) {
      return { message: "Este menú ya está publicado."};
    }

    await this.prisma.menu.update({
      where: { id },
      data: { publicado: true },
    });

    return { message: "Menú publicado exitosamente."};

  }

  async removeMenu(id: number): Promise<{ message: string }> {
    const menu = await this.prisma.menu.findUnique({
      where: { id }
    });

    if (!menu) {
      throw new NotFoundException("No se encontró menú");
    }

    if(menu.publicado){
      throw new ConflictException('No se puede eliminar el menu porque ya esta publicado')
    }

    await this.prisma.menu.delete({
      where: { id },
    });
    
    return {message:"Menu eliminado satisfactoriamente"}
  }
}
