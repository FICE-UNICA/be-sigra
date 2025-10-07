import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DepartamentoModule } from './departamento/departamento.module';
import { PlatoModule } from './plato/plato.module';
import { MenuModule } from './menu/menu.module';
import { ReservaModule } from './reserva/reserva.module';

@Module({
  imports: [AuthModule, UsersModule, DepartamentoModule, PlatoModule, MenuModule, ReservaModule],
})
export class AppModule {}
