import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateMenuDto } from './dto/createMenu.dto';
import { UpdateMenuDto } from './dto/updateMenu.dto';
import { Menu } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) { }

  async getAllMenu() {
    return this.prisma.menu.findMany({
      select: {
        id: true,
        fecha: true,
        publicado: true
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
      id: menu.id,
      fecha: menu.fecha,
      publicado: menu.publicado,
      platos: menu.menuPlatos.map(mp => ({
        id_plato: mp.Plato.id,
        nombre: mp.Plato.nombre,
        precio: mp.Plato.precio,
        elegible: mp.elegible,
      })),
    };

  }

  async findByFecha(fechaStr: string) {
    const menu = await this.prisma.menu.findUnique({
      where: { fecha: new Date(fechaStr + 'T00:00:00') },
      include: {
        menuPlatos: {
          include: { Plato: true },
        },
      },
    });

    if (!menu || !menu.publicado) {
      throw new NotFoundException(
        `No existe menu publicado para la fecha ${fechaStr}`
      );
    }

    return {
      fecha: menu.fecha,
      publicado: menu.publicado,
      platos: menu.menuPlatos.map(mp => ({
        id: mp.id,
        nombre: mp.Plato.nombre,
        precio: mp.Plato.precio,
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

    const ids = menuPlatos.map(mp => mp.platoId);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== ids.length) {
      throw new BadRequestException(
        'No se permiten platos duplicados en el menú',
      );
    }

    const existentes = await this.prisma.plato.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    const encontrados = existentes.map(p => p.id);
    const faltantes = ids.filter(id => !encontrados.includes(id));

    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No existen los siguientes platos: ${faltantes.join(', ')}`
      );
    }

    const platosData = menuPlatos.map(mp => ({
      elegible: mp.elegible,
      Plato: {
        connect: { id: mp.platoId },
      },
    }));

    await this.prisma.menu.create({
      data: {
        fecha,
        menuPlatos: {
          create: platosData,
        },
      },
    });

    return { message: 'Menú creado satisfactoriamente' };
  }


  async updateMenu(
    id: number,
    dto: UpdateMenuDto,
  ): Promise<{ message: string }> {

    const { fecha, menuPlatos } = dto;

    // 1️⃣ Verificar que el menú exista
    const existing = await this.prisma.menu.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException(`No existe un menú con id ${id}`);
    }

    // 2️⃣ No permitir editar si está publicado
    if (existing.publicado) {
      throw new ConflictException(
        'No se puede editar el menú porque ya está publicado',
      );
    }

    // 3️⃣ Validar platos duplicados
    const ids = menuPlatos.map(mp => mp.platoId);
    const uniqueIds = new Set(ids);

    if (uniqueIds.size !== ids.length) {
      throw new BadRequestException(
        'No se permiten platos duplicados en el menú',
      );
    }

    // 4️⃣ Verificar que los platos existan
    const existentes = await this.prisma.plato.findMany({
      where: { id: { in: ids } },
      select: { id: true },
    });

    const encontrados = existentes.map(p => p.id);
    const faltantes = ids.filter(id => !encontrados.includes(id));

    if (faltantes.length > 0) {
      throw new NotFoundException(
        `No existen los siguientes platos: ${faltantes.join(', ')}`,
      );
    }

    // 5️⃣ Verificar conflicto de fecha (si cambió)
    if (fecha && fecha.getTime() !== existing.fecha.getTime()) {
      const conflicto = await this.prisma.menu.findUnique({
        where: { fecha },
      });

      if (conflicto) {
        throw new ConflictException(
          `Ya existe un menú para la fecha ${fecha.toISOString()}`,
        );
      }
    }

    // 6️⃣ Actualizar dentro de transacción
    await this.prisma.$transaction(async (tx) => {
      await tx.menu.update({
        where: { id },
        data: {
          fecha,
          menuPlatos: {
            deleteMany: {}, // elimina los actuales
            create: menuPlatos.map(mp => ({
              elegible: mp.elegible,
              Plato: {
                connect: { id: mp.platoId },
              },
            })),
          },
        },
      });
    });

    return { message: 'Menú editado satisfactoriamente' };
  }



  async publicarMenu(id: number): Promise<{ message: string }> {
    const menu = await this.prisma.menu.findUnique({
      where: { id }
    })

    if (!menu) {
      throw new NotFoundException("No se encontró el menú.");
    }

    if (menu.publicado) {
      return { message: "Este menú ya está publicado." };
    }

    await this.prisma.menu.update({
      where: { id },
      data: { publicado: true },
    });

    return { message: "Menú publicado exitosamente." };

  }

  async removeMenu(id: number): Promise<{ message: string }> {
    const menu = await this.prisma.menu.findUnique({
      where: { id }
    });

    if (!menu) {
      throw new NotFoundException("No se encontró menú");
    }

    if (menu.publicado) {
      throw new ConflictException('No se puede eliminar el menu porque ya esta publicado')
    }

    await this.prisma.menu.delete({
      where: { id },
    });

    return { message: "Menu eliminado satisfactoriamente" }
  }
}
