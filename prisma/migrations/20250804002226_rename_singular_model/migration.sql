/*
  Warnings:

  - You are about to drop the `Departamentos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuPlatos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Platos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReservaPlatos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reservas` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Usuarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuPlatos" DROP CONSTRAINT "MenuPlatos_platoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaPlatos" DROP CONSTRAINT "ReservaPlatos_menuPlatoId_fkey";

-- DropForeignKey
ALTER TABLE "ReservaPlatos" DROP CONSTRAINT "ReservaPlatos_reservaId_fkey";

-- DropForeignKey
ALTER TABLE "Reservas" DROP CONSTRAINT "Reservas_userId_fkey";

-- DropForeignKey
ALTER TABLE "Usuarios" DROP CONSTRAINT "Usuarios_departamentoId_fkey";

-- DropTable
DROP TABLE "Departamentos";

-- DropTable
DROP TABLE "MenuPlatos";

-- DropTable
DROP TABLE "Platos";

-- DropTable
DROP TABLE "ReservaPlatos";

-- DropTable
DROP TABLE "Reservas";

-- DropTable
DROP TABLE "Usuarios";

-- CreateTable
CREATE TABLE "Usuario" (
    "id" SERIAL NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoPat" TEXT NOT NULL,
    "apellidoMat" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamento" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Departamento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fechaReserva" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaPlato" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "menuPlatoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ReservaPlato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuPlato" (
    "id" SERIAL NOT NULL,
    "platoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "elejible" BOOLEAN NOT NULL,

    CONSTRAINT "MenuPlato_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plato" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Plato_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_username_key" ON "Usuario"("username");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaPlato" ADD CONSTRAINT "ReservaPlato_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reserva"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaPlato" ADD CONSTRAINT "ReservaPlato_menuPlatoId_fkey" FOREIGN KEY ("menuPlatoId") REFERENCES "MenuPlato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlato" ADD CONSTRAINT "MenuPlato_platoId_fkey" FOREIGN KEY ("platoId") REFERENCES "Plato"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
