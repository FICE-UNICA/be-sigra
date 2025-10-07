import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto }   from './dto/createUser.dto';
import { UpdateUserDto }   from './dto/updateUser.dto';
import { PrismaService }   from 'src/prisma.service';
import * as bcrypt         from 'bcrypt';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(){

    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellidoPat: true,
        apellidoMat: true,
        username: true,
        Departamento: { select: { nombre: true } },
        role: true
      }
    }).then(usuarios =>
      usuarios.map(u => ({
        id: u.id,
        nombre: u.nombre,
        apellidoPat: u.apellidoPat,
        apellidoMat: u.apellidoMat,
        username: u.username,
        departamento: u.Departamento.nombre,
        role: u.role
      }))
    )
  }

  async findOne(id: number){
    const user = await this.prisma.usuario.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        apellidoPat: true,
        apellidoMat: true,
        username: true,
        role: true,
        Departamento: {
          select: { nombre: true }
        }
      }
    })

    if (!user) {
      throw new NotFoundException('Usuario no encontrado')
    }

    return {
      id: user.id,
      nombre: user.nombre,
      apellidoPat: user.apellidoPat,
      apellidoMat: user.apellidoMat,
      username: user.username,
      role: user.role,
      departamento: user.Departamento.nombre
    }
  }


  async create(createUserDto: CreateUserDto): Promise<{message: string}> {
     const { departamento: deptoNombre, password, ...userData } = createUserDto;

     const departamento = await this.prisma.departamento.findUnique({
       where: { nombre: deptoNombre },
     });
     if (!departamento) {
       throw new NotFoundException(`El departamento "${deptoNombre}" no existe`);
     }

     const hashedPassword = await bcrypt.hash(password, 10);

     await this.prisma.usuario.create({
       data: {
         departamentoId: departamento.id,
         password: hashedPassword,
         ...userData,
       },
     });

     return { message: 'Usuario creado satisfactoriamente' };
  }

  async update( id: number, dto: UpdateUserDto): Promise<{ message: string }> {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id },
    });
    if (!usuarioExistente) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    if (dto.username) {
      const userduplicado = await this.prisma.usuario.findFirst({
        where: {
          username: dto.username,
          NOT: { id },
        },
      });
      if (userduplicado) {
        throw new ConflictException(
          `El usuario '${dto.username}' ya está en uso.`,
        );
      }
    }

    const data: Record<string, any> = {};

    if (dto.nombre)      data.nombre      = dto.nombre;
    if (dto.apellidoPat) data.apellidoPat = dto.apellidoPat;
    if (dto.apellidoMat) data.apellidoMat = dto.apellidoMat;
    if (dto.username)    data.username    = dto.username;

    if (dto.departamento) {
      const depto = await this.prisma.departamento.findUnique({
        where: { nombre: dto.departamento },
      });
      if (!depto) {
        throw new BadRequestException(
          `El departamento '${dto.departamento}' no existe`,
        );
      }
      data.departamentoId = depto.id;
    }

    await this.prisma.usuario.update({
      where: { id },
      data,
    });

    return { message: 'Usuario editado satisfactoriamente' };
  }

  async changePassword(id: number,dto: ChangePasswordDto): Promise<{ message: string }> {
   await this.findOne(id);

   const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.usuario.update({
      where: { id },
      data: { password: hashed },
    });
    return { message: 'Cambio de contraseña satisfactorio' };
  }

  async remove(id: number): Promise<{message: string}> {
    await this.findOne(id);
    await this.prisma.usuario.delete({ where: { id } });

    return {message:"Usuario eliminado satisfactoriamente"}
  }
}
