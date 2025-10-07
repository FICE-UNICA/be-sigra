import { Controller, Get, Post, Delete, Param, Body, ParseIntPipe, Patch, UseGuards, Header} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('create')
  @UseGuards(AdminGuard)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Patch('update/:id')
  @UseGuards(AdminGuard)
  update(
     @Param('id', ParseIntPipe) id: number,
     @Body() updateUserDto: UpdateUserDto
   ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Patch('changepass/:id')
  changePassword(
    @Param('id',   ParseIntPipe) id: number,
    @Body()       dto: ChangePasswordDto
  ) {
    return this.usersService.changePassword(id, dto);
  }

  @Delete('destroy/:id')
  @UseGuards(AdminGuard)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
