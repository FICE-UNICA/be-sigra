import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReservaDto } from './dto/reservaCreate.dto';
import { UpdateReservaDto } from './dto/reservaUpdate.dto';

@Injectable()
export class ReservaService {
  constructor(private readonly prisma: PrismaService) { }

  async getOneReservation(user_token, id: number) {
    const userId = user_token.user_id;

    const reserva = await this.prisma.reserva.findUnique({
      where: { id },
      include: {
        ReservaPlatos: {
          include: {
            MenuPlato: {
              include: {
                Plato: true
              }
            }
          }
        }
      }
    });

    if (!reserva) {
      throw new NotFoundException('Reserva no encontrada');
    }

    if (reserva.userId !== userId) {
      throw new ForbiddenException('No tienes permiso para ver esta reserva');
    }

    const precioTotal = reserva.ReservaPlatos.reduce((sum, rp) => {
      const precio = rp.MenuPlato?.Plato?.precio || 0
      return sum + (precio * rp.cantidad)
    }, 0)

    return {
      id: reserva.id,
      fechaReserva: reserva.fechaReserva,
      userId: reserva.userId,
      precioTotal,
      platos: reserva.ReservaPlatos.map(rp => ({
        id: rp.id,
        nombre: rp.MenuPlato?.Plato?.nombre || 'Plato no encontrado',
        cantidad: rp.cantidad,
        precio: rp.MenuPlato?.Plato?.precio || 0,
        elegible: rp.MenuPlato?.elegible ?? false
      }))
    };
  }

  async getAllReservationsUser(user_token) {
    const userId = user_token.user_id;

    const reservas = await this.prisma.reserva.findMany({
      where: { userId },
      include: {
        ReservaPlatos: {
          include: {
            MenuPlato: {
              include: {
                Plato: true
              }
            }
          }
        }
      },
      orderBy: {
        fechaReserva: 'desc'
      }
    });

    return reservas.map(reserva => {
      const precioTotal = reserva.ReservaPlatos.reduce((sum, rp) => {
        const precio = rp.MenuPlato?.Plato?.precio || 0
        return sum + (precio * rp.cantidad)
      }, 0)

      return {
        id: reserva.id,
        fechaReserva: reserva.fechaReserva,
        userId: reserva.userId,
        precioTotal,
        platos: reserva.ReservaPlatos.map(rp => ({
          id: rp.id,
          nombre: rp.MenuPlato?.Plato?.nombre || 'Plato no encontrado',
          cantidad: rp.cantidad,
          precio: rp.MenuPlato?.Plato?.precio || 0,
          elegible: rp.MenuPlato?.elegible ?? false
        }))
      }
    });
  }

  async reservar(userToken: any, reservaDto: CreateReservaDto) {
    const userId = userToken.user_id;
    const { fecha, reservaPlatos } = reservaDto;

    // 🔹 Verificar si ya existe reserva para esa fecha
    const existing = await this.prisma.reserva.findFirst({
      where: { userId, fechaReserva: fecha }
    });

    if (existing) {
      throw new BadRequestException('Ya hiciste una reserva para esta fecha.');
    }

    // 🔹 Validar fecha límite (23:00 del día anterior) - Hora Cuba
    const now = new Date();
    const fechaStr = fecha.toISOString().split('T')[0];
    const [year, month, day] = fechaStr.split('-');
    const fechaMenu = new Date(Number(year), Number(month) - 1, Number(day));
    const cutoff = new Date(fechaMenu);
    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(18, 0, 0, 0); // 23:00 hora Cuba = 18:00 UTC (en invierno)

    if (now > cutoff) {
      throw new ForbiddenException(
        'Ya no es posible reservar. El límite es antes de las 23:00 del día anterior.'
      );
    }

    // 🔹 Buscar menú del día
    const menu = await this.prisma.menu.findUnique({
      where: { fecha: new Date(fechaStr + 'T00:00:00') },
      include: {
        menuPlatos: true
      }
    });

    if (!menu) {
      throw new NotFoundException(
        `No existe menú publicado para la fecha ${fecha.toISOString().slice(0, 10)}`
      );
    }

    // 🔹 Crear un Map por opcionId (id de MenuPlato)
    const menuMap = new Map<number, { elegible: boolean }>();

    menu.menuPlatos.forEach(mp => {
      menuMap.set(mp.id, { elegible: mp.elegible });
    });

    // 🔹 Validar cada opcionId recibido
    const platosParaCrear = reservaPlatos.map(rp => {
      const mpData = menuMap.get(rp.opcionId);

      if (!mpData) {
        throw new NotFoundException(
          `La opción con id ${rp.opcionId} no pertenece al menú de ${fecha
            .toISOString()
            .slice(0, 10)}`
        );
      }

      if (!mpData.elegible && rp.cantidad > 1) {
        throw new BadRequestException(
          `La opción con id ${rp.opcionId} sólo permite una unidad.`
        );
      }

      return {
        menuPlatoId: rp.opcionId, // 🔥 ahora se usa directamente
        cantidad: rp.cantidad
      };
    });

    // 🔹 Crear reserva
    await this.prisma.reserva.create({
      data: {
        fechaReserva: fecha,
        userId,
        ReservaPlatos: {
          create: platosParaCrear
        }
      }
    });

    return { message: 'Reserva realizada satisfactoriamente' };
  }


  async editarReserva(
    userToken: any,
    reservaUpdateDto: UpdateReservaDto,
    id: number
  ) {
    const userId = userToken.user_id;
    const { fecha, reservaPlatos } = reservaUpdateDto;

    // 🔹 Verificar que la reserva exista y pertenezca al usuario
    const reservaActual = await this.prisma.reserva.findUnique({
      where: { id },
      include: { ReservaPlatos: true }
    });

    if (!reservaActual || reservaActual.userId !== userId) {
      throw new NotFoundException('Reserva no encontrada o acceso denegado.');
    }

    // 🔹 Verificar conflicto de fecha
    const conflicto = await this.prisma.reserva.findFirst({
      where: {
        userId,
        fechaReserva: fecha,
        id: { not: id }
      }
    });

    if (conflicto) {
      throw new BadRequestException('Ya tienes otra reserva en esa fecha.');
    }

    const now = new Date();
    const fechaStr = fecha.toISOString().split('T')[0];
    const [year, month, day] = fechaStr.split('-');
    const fechaMenu = new Date(Number(year), Number(month) - 1, Number(day));
    const cutoff = new Date(fechaMenu);
    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(18, 0, 0, 0);

    if (now > cutoff) {
      throw new ForbiddenException(
        'Ya no es posible modificar a esa fecha. El límite es antes de las 23:00 del día anterior.'
      );
    }

    const menu = await this.prisma.menu.findUnique({
      where: { fecha: new Date(fechaStr + 'T00:00:00') },
      include: { menuPlatos: true }
    });

    if (!menu) {
      throw new NotFoundException(
        `No existe menú para la fecha ${fecha.toISOString().slice(0, 10)}.`
      );
    }

    const menuMap = new Map<number, { elegible: boolean }>();

    menu.menuPlatos.forEach(mp => {
      menuMap.set(mp.id, { elegible: mp.elegible });
    });

    const platosParaCrear = reservaPlatos.map(rp => {
      const mpData = menuMap.get(rp.opcionId);

      if (!mpData) {
        throw new NotFoundException(
          `La opción con id ${rp.opcionId} no pertenece al menú de ${fecha
            .toISOString()
            .slice(0, 10)}.`
        );
      }

      if (!mpData.elegible && rp.cantidad > 1) {
        throw new BadRequestException(
          `La opción con id ${rp.opcionId} sólo permite una unidad.`
        );
      }

      return {
        menuPlatoId: rp.opcionId,
        cantidad: rp.cantidad
      };
    });

    await this.prisma.$transaction([
      this.prisma.reservaPlato.deleteMany({ where: { reservaId: id } }),

      this.prisma.reserva.update({
        where: { id },
        data: { fechaReserva: fecha }
      }),

      this.prisma.reservaPlato.createMany({
        data: platosParaCrear.map(p => ({
          reservaId: id,
          menuPlatoId: p.menuPlatoId,
          cantidad: p.cantidad
        }))
      })
    ]);

    return { message: 'Reserva actualizada satisfactoriamente' };
  }

  async cancelarReserva(user_token, id: number): Promise<{ message: string }> {
    const user_id = user_token.user_id;

    const existReserva = await this.prisma.reserva.findUnique({
      where: { id }
    });

    if (!existReserva) {
      throw new NotFoundException("No se encontró esa reserva");
    }

    if (existReserva.userId !== user_id) {
      throw new ForbiddenException(
        'No tienes permiso para cancelar esta reserva',
      );
    }

    const now = new Date();
    const fecha = existReserva.fechaReserva;

    const fechaStr = fecha.toISOString().split('T')[0];
    const [year, month, day] = fechaStr.split('-');

    const fechaMenu = new Date(Number(year), Number(month) - 1, Number(day));
    const cutoff = new Date(fechaMenu);

    cutoff.setDate(cutoff.getDate() - 1);
    cutoff.setHours(18, 0, 0, 0);

    if (now > cutoff) {
      throw new ForbiddenException(
        'Ya no es posible cancelar. El límite es antes de las 23:00 del día anterior.'
      );
    }

    await this.prisma.reserva.delete({
      where: { id },
    });

    return { message: 'Reserva cancelada exitosamente.' };
  }


  async getAllMenusWithReservations() {
    const menus = await this.prisma.menu.findMany({
      where: { publicado: true },
      include: {
        menuPlatos: {
          include: {
            Plato: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    const menusWithReservations = await Promise.all(
      menus.map(async (menu) => {
        const menuDateStr = menu.fecha.toISOString().split('T')[0];
        const menuDate = new Date(menuDateStr + 'T12:00:00Z');
        const nextDay = new Date(menuDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const count = await this.prisma.reserva.count({
          where: {
            fechaReserva: {
              gte: menuDate,
              lt: nextDay
            }
          }
        });

        return {
          id: menu.id,
          fecha: menu.fecha,
          publicado: menu.publicado,
          cantidadReservaciones: count,
          opciones: menu.menuPlatos.map(mp => ({
            id: mp.id,
            nombre: mp.Plato.nombre,
            elegible: mp.elegible
          }))
        };
      })
    );

    return menusWithReservations;
  }

  async getReservationsByMenu(menuId: number) {
    const menu = await this.prisma.menu.findUnique({
      where: { id: menuId },
      include: {
        menuPlatos: {
          include: {
            Plato: true
          }
        }
      }
    });

    if (!menu) {
      throw new NotFoundException('Menú no encontrado');
    }

    const opcionesMenu = menu.menuPlatos.map(mp => ({
      id: mp.id,
      nombre: mp.Plato.nombre,
      elegible: mp.elegible
    }));

    const menuDateStr = menu.fecha.toISOString().split('T')[0];
    const menuDate = new Date(menuDateStr + 'T12:00:00Z');
    const nextDay = new Date(menuDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const reservas = await this.prisma.reserva.findMany({
      where: {
        fechaReserva: {
          gte: menuDate,
          lt: nextDay
        }
      },
      include: {
        Usuario: true,
        ReservaPlatos: true
      }
    });

    const totalPorOpcion: Record<number, number> = {};
    opcionesMenu.forEach(op => {
      totalPorOpcion[op.id] = 0;
    });

    const empleados = reservas.map(reserva => {
      const reservaOpciones: Record<number, number> = {};

      opcionesMenu.forEach(op => {
        reservaOpciones[op.id] = 0;
      });

      reserva.ReservaPlatos.forEach(rp => {
        if (reservaOpciones.hasOwnProperty(rp.menuPlatoId)) {
          reservaOpciones[rp.menuPlatoId] += rp.cantidad;
          totalPorOpcion[rp.menuPlatoId] += rp.cantidad;
        }
      });

      return {
        id: reserva.id,
        nombre: `${reserva.Usuario.nombre} ${reserva.Usuario.apellidoPat || ''} ${reserva.Usuario.apellidoMat || ''}`.trim(),
        opciones: reservaOpciones
      };
    });

    return {
      menuId: menu.id,
      fecha: menu.fecha,
      opciones: opcionesMenu,
      totalPorOpcion,
      empleados
    };
  }
}
