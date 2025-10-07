import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwt.constants';
import { AuthGuard } from './guards/auth.guard';
import { UserGuard } from './guards/user.guard';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports:[
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions:{expiresIn: '10h'}
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, AuthGuard, UserGuard, AdminGuard],
  exports: [AuthGuard, UserGuard, AdminGuard, JwtModule],
})
export class AuthModule {}
