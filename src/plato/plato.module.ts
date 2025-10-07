import { Module } from '@nestjs/common';
import { PlatoController } from './plato.controller';
import { PlatoService } from './plato.service';
import { PrismaService } from 'src/prisma.service';
import { UniquePlatoNameConstraint } from './validatorPlato/uniqueNomPlato.validator';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [PlatoController],
  providers: [PlatoService, PrismaService,UniquePlatoNameConstraint]
})
export class PlatoModule {}
