import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ReservaService } from './reserva.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Request } from 'express'
import { CreateReservaDto } from './dto/reservaCreate.dto';
import { UpdateReservaDto } from './dto/reservaUpdate.dto';
import { UserGuard } from 'src/auth/guards/user.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';


@Controller('reserva')
@UseGuards(AuthGuard)
export class ReservaController {
    constructor(private readonly reservaService: ReservaService){}

    @Get('getAllReservationsUser')
    getAllReservationsUser(@Req() req: Request) {
      const user_token=req.user
      return this.reservaService.getAllReservationsUser(user_token);
    }

    @Get('getAllMenusWithReservations')
    @UseGuards(AdminGuard)
    getAllMenusWithReservations() {
      return this.reservaService.getAllMenusWithReservations();
    }

    @Get('getReservationsByMenu/:menuId')
    @UseGuards(AdminGuard)
    getReservationsByMenu(@Param('menuId', ParseIntPipe) menuId: number) {
      return this.reservaService.getReservationsByMenu(menuId);
    }
       
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
      const user_token=req.user
      return this.reservaService.getOneReservation(user_token,id);
    }

    @Post('create')
    @UseGuards(UserGuard)
    reservar (@Req() req: Request, @Body() reservaCreateDto: CreateReservaDto){
        const user_token= req.user
        return this.reservaService.reservar(user_token,reservaCreateDto)
    }

    @Put('update/:id')
    @UseGuards(UserGuard)
    editarReserva (
        @Param('id', ParseIntPipe) id: number,
        @Body() reservaUpdateDto: UpdateReservaDto,
        @Req() req: Request){
        const user_token= req.user
        return this.reservaService.editarReserva(user_token,reservaUpdateDto,id)
    }

    @Delete('destroy/:id')
    @UseGuards(UserGuard)
    cancelarReserva (@Param('id', ParseIntPipe) id: number,@Req() req: Request){
        const user_token= req.user
        return this.reservaService.cancelarReserva(user_token, id)
    }
}
