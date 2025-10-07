import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/createMenu.dto';
import { UpdateMenuDto } from './dto/updateMenu.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { AuthGuard } from 'src/auth/guards/auth.guard';


@Controller('menu')
@UseGuards(AuthGuard)
export class MenuController {
    constructor(private readonly menuService: MenuService){}

    @Get()
    @UseGuards(AdminGuard)
    findAll() {
      return this.menuService.getAllMenu();
    }
      
    @Get(':id')
    @UseGuards(AdminGuard)
    findOne(@Param('id', ParseIntPipe) id: number) {
      return this.menuService.getMenuById(id);
    }

    @Get('forFecha/:fecha')
    findByFecha(@Param('fecha') fecha: string) {
      const fechaParse = new Date(fecha)
      return this.menuService.findByFecha(fechaParse);
    }
        
    @Post('create')
    @UseGuards(AdminGuard)
    create(@Body() createMenuDto: CreateMenuDto) {
      return this.menuService.createMenu(createMenuDto);
    }
        
    @Put('update/:id')
    @UseGuards(AdminGuard)
    update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updateMenuDto: UpdateMenuDto
    ) {
      return this.menuService.updateMenu(id, updateMenuDto);
    }
        
    @Patch('publish/:id')
    @UseGuards(AdminGuard)
    publicarMenu(@Param('id', ParseIntPipe) id: number,){
      return this.menuService.publicarMenu(id);
    }

    @Delete('destroy/:id')
    @UseGuards(AdminGuard)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.menuService.removeMenu(id);
    }
}
