import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { PlatoService } from './plato.service';
import { CreatePlatoDto } from './dto/create-plato.dto';
import { UpdatePlatoDto } from './dto/update-plato.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('plato')
@UseGuards(AuthGuard, AdminGuard)
export class PlatoController {
    constructor(private readonly platoService: PlatoService){}
    
      @Get()
      findAll() {
        return this.platoService.findAll();
      }
  
      @Get(':id')
      findOne(@Param('id', ParseIntPipe) id: number) {
        return this.platoService.findOne(id);
      }
    
      @Post('create')
      create(@Body() createDptoDto: CreatePlatoDto) {
        return this.platoService.create(createDptoDto);
      }
    
      @Put('update/:id')
      update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateDptoDto: UpdatePlatoDto
      ) {
        return this.platoService.update(id, updateDptoDto);
      }
    
      @Delete('destroy/:id')
      remove(@Param('id', ParseIntPipe) id: number) {
        return this.platoService.remove(id);
      }
}
