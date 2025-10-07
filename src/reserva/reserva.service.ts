import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReservaDto } from './dto/reservaCreate.dto';
import { UpdateReservaDto } from './dto/reservaUpdate.dto';

@Injectable()
export class ReservaService {
    constructor(private readonly prisma:PrismaService){}

    async getOneReservation(user_token,id:number){
      
    }

    async getAllReservationsUser(user_token){
                   
    }

    async reservar(userToken: any, reservaDto: CreateReservaDto) {
      const userId = userToken.user_id
      const { fecha, reservaPlatos } = reservaDto
    
      const existing = await this.prisma.reserva.findFirst({
        where: { userId, fechaReserva: fecha }
      })
      if (existing) {
        throw new BadRequestException('Ya existe una reserva para esta fecha.')
      }
    
      const now = new Date()
      const cutoff = new Date(fecha)
      cutoff.setDate(cutoff.getDate() - 1)
      cutoff.setHours(23, 0, 0, 0)
    
      if (now > cutoff) {
        throw new ForbiddenException(
          'Ya no es posible reservar. El límite es antes de las 23:00 del día anterior.'
        )
      }
    
      const menu = await this.prisma.menu.findUnique({
        where: { fecha },
        include: {
          menuPlatos: {
            include: {
              Plato: { select: { nombre: true } }
            }
          }
        }
      })
    
      if (!menu) {
        throw new NotFoundException(
          `No existe menú para la fecha ${fecha.toISOString().slice(0, 10)}`
        )
      }
    
      const menuMap = new Map<string, { id: number; elegible: boolean }>()
      menu.menuPlatos.forEach(mp => {
        const nombre = mp.Plato.nombre.trim().toLowerCase()
        menuMap.set(nombre, { id: mp.id, elegible: mp.elegible })
      })
    
      const platosParaCrear = reservaPlatos.map(rp => {
        const key = rp.nombre.trim().toLowerCase()
        const mpData = menuMap.get(key)
    
        if (!mpData) {
          throw new NotFoundException(
            `El plato "${rp.nombre}" no está en el menú de ${fecha
              .toISOString()
              .slice(0, 10)}`
          )
        }
    
        if (!mpData.elegible && rp.cantidad > 1) {
          throw new BadRequestException(
            `El plato "${rp.nombre}" sólo permite una unidad.`
          );
        }
        return {
          menuPlatoId: mpData.id,
          cantidad: rp.cantidad
        }
      })
    
      await this.prisma.reserva.create({
        data: {
          fechaReserva: fecha,
          userId,
          ReservaPlatos: {
            create: platosParaCrear
          }
        },
        include: {
          ReservaPlatos: {
            include: {
              MenuPlato: {
                include: { Plato: true }
              }
            }
          }
        }
      })
    
      return { message: 'Reserva realizada satisfactoriamente' }
    } 

    async editarReserva( userToken: any, reservaUpdateDto: UpdateReservaDto, id: number){
      const userId = userToken.user_id;
      const { fecha, reservaPlatos } = reservaUpdateDto;

      const reservaActual = await this.prisma.reserva.findUnique({
        where: { id },
        include: { ReservaPlatos: true }
      });
      if (!reservaActual || reservaActual.userId !== userId) {
        throw new NotFoundException('Reserva no encontrada o acceso denegado.');
      }

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
      const cutoff = new Date(fecha);
      cutoff.setDate(cutoff.getDate() - 1);
      cutoff.setHours(23, 0, 0, 0);
      if (now > cutoff) {
        throw new ForbiddenException(
          'Ya no es posible modificar a esa fecha. El límite es antes de las 23:00 del día anterior.'
        );
      }

      const menu = await this.prisma.menu.findUnique({
        where: { fecha },
        include: {
          menuPlatos: {
            include: { Plato: { select: { nombre: true } } }
          }
        }
      });
      if (!menu) {
        throw new NotFoundException(
          `No existe menú para la fecha ${fecha.toISOString().slice(0, 10)}.`
        );
      }
      const menuMap = new Map<string, { id: number; elegible: boolean }>();
      menu.menuPlatos.forEach(mp => {
        const key = mp.Plato.nombre.trim().toLowerCase();
        menuMap.set(key, { id: mp.id, elegible: mp.elegible });
      });

      const platosParaCrear = reservaPlatos.map(rp => {
        const key = rp.nombre.trim().toLowerCase();
        const mpData = menuMap.get(key);

        if (!mpData) {
          throw new NotFoundException(
            `El plato "${rp.nombre}" no está en el menú de ${fecha
              .toISOString()
              .slice(0, 10)}.`
          );
        }

        if (!mpData.elegible && rp.cantidad > 1) {
          throw new BadRequestException(
            `El plato "${rp.nombre}" sólo permite una unidad.`
          );
        }

        return {
          menuPlatoId: mpData.id,
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

    async cancelarReserva(user_token, id:number): Promise<{message: string}>{
      const user_id=user_token.user_id
      const existReserva= await this.prisma.reserva.findUnique({
          where: {id}
      })
      if(!existReserva){
          throw new NotFoundException({message:"No se encontro esa reserva"})
      }

      if (existReserva.userId !== user_id) {
        throw new ForbiddenException(
          'No tienes permiso para cancelar esta reserva',
        );
      }

      await this.prisma.reserva.delete({
        where: { id },
      });

      return { message: 'Reserva cancelada exitosamente.' };
    }
}
