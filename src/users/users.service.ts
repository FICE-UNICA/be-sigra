import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto';
import { UpdateUserDto } from './dto/updateUser.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dto/changePassword.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  findAll() {

    return this.prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        apellidoPat: true,
        apellidoMat: true,
        username: true,
        Departamento: { 
          select: {
            id: true,
            nombre: true } },
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
        departamentoId: u.Departamento.id,
        role: u.role
      }))
    )
  }

  async findOne(id: number) {
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
          select: {
            id: true,
            nombre: true
          }
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
      departamento: user.Departamento.nombre,
      departamentoId: user.Departamento.id 
    }
  }



  async create(createUserDto: CreateUserDto): Promise<{ message: string }> {
    const { departamentoId, password, ...userData } = createUserDto;

    const departamento = await this.prisma.departamento.findUnique({
      where: { id: departamentoId },
    });

    if (!departamento) {
      throw new NotFoundException(
        `El departamento con id ${departamentoId} no existe`,
      );
    }

    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { username: userData.username },
    });

    if (usuarioExistente) {
      throw new ConflictException(
        `El usuario '${userData.username}' ya está en uso.`,
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await this.prisma.usuario.create({
      data: {
        ...userData,
        password: hashedPassword,
        departamentoId: departamentoId,
      },
    });

    return { message: 'Usuario creado satisfactoriamente' };
  }


  async update(id: number, dto: UpdateUserDto): Promise<{ message: string }> {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!usuarioExistente) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    // Validar username duplicado si se está actualizando
    if (dto.username) {
      const userDuplicado = await this.prisma.usuario.findFirst({
        where: {
          username: dto.username,
          NOT: { id },
        },
      });

      if (userDuplicado) {
        throw new ConflictException(
          `El usuario '${dto.username}' ya está en uso.`,
        );
      }
    }

    const data: Record<string, any> = {};

    if (dto.nombre) data.nombre = dto.nombre;
    if (dto.apellidoPat) data.apellidoPat = dto.apellidoPat;
    if (dto.apellidoMat) data.apellidoMat = dto.apellidoMat;
    if (dto.username) data.username = dto.username;

    // ✅ Cambio importante: ahora usamos departamentoId
    if (dto.departamentoId) {
      const departamento = await this.prisma.departamento.findUnique({
        where: { id: dto.departamentoId },
      });

      if (!departamento) {
        throw new BadRequestException(
          `El departamento con id ${dto.departamentoId} no existe`,
        );
      }

      data.departamentoId = dto.departamentoId;
    }

    await this.prisma.usuario.update({
      where: { id },
      data,
    });

    return { message: 'Usuario editado satisfactoriamente' };
  }

  async changePassword(id: number, dto: ChangePasswordDto): Promise<{ message: string }> {
    await this.findOne(id);

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.usuario.update({
      where: { id },
      data: { password: hashed },
    });
    return { message: 'Cambio de contraseña satisfactorio' };
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.findOne(id);
    await this.prisma.usuario.delete({ where: { id } });

    return { message: "Usuario eliminado satisfactoriamente" }
  }
}
