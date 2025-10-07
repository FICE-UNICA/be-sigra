/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Plato` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "MenuPlato" DROP CONSTRAINT "MenuPlato_platoId_fkey";

-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_userId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaPlato" DROP CONSTRAINT "ReservaPlato_menuPlatoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaPlato" DROP CONSTRAINT "ReservaPlato_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "Usuario" DROP CONSTRAINT "Usuario_departamentoId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Plato_nombre_key" ON "Plato"("nombre");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaPlato" ADD CONSTRAINT "ReservaPlato_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaPlato" ADD CONSTRAINT "ReservaPlato_menuPlatoId_fkey" FOREIGN KEY ("menuPlatoId") REFERENCES "MenuPlato"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlato" ADD CONSTRAINT "MenuPlato_platoId_fkey" FOREIGN KEY ("platoId") REFERENCES "Plato"("id") ON DELETE CASCADE ON UPDATE CASCADE;
