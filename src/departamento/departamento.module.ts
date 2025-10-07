import { Module } from '@nestjs/common';
import { DepartamentoController } from './departamento.controller';
import { DepartamentoService } from './departamento.service';
import { PrismaService } from 'src/prisma.service';
import { UniqueDepartamentoNameConstraint } from './validatorDpto/uniqueNombre.validator';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [DepartamentoController],
  providers: [DepartamentoService, PrismaService, UniqueDepartamentoNameConstraint]
})
export class DepartamentoModule {}
