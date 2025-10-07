import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma:PrismaService, private jwtService:JwtService){}

    async login(userLogin: LoginUserDto){
      const {user, password}=userLogin
      
      const usuarioExist = await this.prisma.usuario.findUnique({ where: { username: user } });

      if (!usuarioExist) {
        throw new UnauthorizedException('Usuario no existente');
      }

      const passwordMatch = await compare(password, usuarioExist.password);
      if (!passwordMatch) {
       throw new UnauthorizedException('Usuario o contraseña incorrectos');
      }

      const payload={
        user_id: usuarioExist.id,
        name: usuarioExist.nombre, 
        role: usuarioExist.role
      }
      const token=await this.jwtService.signAsync(payload)
      const data= {
        message:`Bienvenido/a ${usuarioExist.nombre}`,
        token
      }
      return data
    }
}
