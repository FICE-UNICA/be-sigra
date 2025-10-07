import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DepartamentoService } from './departamento.service';
import { CreateDptoDto } from './dto/createDpto.dto';
import { UpdateDptoDto } from './dto/updateDpto.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('departamento')
@UseGuards(AuthGuard, AdminGuard)
export class DepartamentoController {
  constructor(private readonly departamentoService: DepartamentoService) {}

  @Get()
  findAll() {
    return this.departamentoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departamentoService.findOne(id);
  }

  @Post('create')
  create(@Body() createDptoDto: CreateDptoDto) {
    return this.departamentoService.create(createDptoDto);
  }

  @Put('update/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDptoDto: UpdateDptoDto
  ) {
    return this.departamentoService.update(id, updateDptoDto);
  }

  @Delete('destroy/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departamentoService.remove(id);
  }
}
