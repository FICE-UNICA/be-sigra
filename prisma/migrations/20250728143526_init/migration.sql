-- CreateTable
CREATE TABLE "Usuarios" (
    "id" SERIAL NOT NULL,
    "departamentoId" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellidoPat" TEXT NOT NULL,
    "apellidoMat" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Departamentos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Departamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reservas" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "fechaReserva" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reservas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReservaPlatos" (
    "id" SERIAL NOT NULL,
    "reservaId" INTEGER NOT NULL,
    "menuPlatoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "ReservaPlatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuPlatos" (
    "id" SERIAL NOT NULL,
    "platoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "elejible" BOOLEAN NOT NULL,

    CONSTRAINT "MenuPlatos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platos" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "precio" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Platos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuarios_username_key" ON "Usuarios"("username");

-- AddForeignKey
ALTER TABLE "Usuarios" ADD CONSTRAINT "Usuarios_departamentoId_fkey" FOREIGN KEY ("departamentoId") REFERENCES "Departamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservas" ADD CONSTRAINT "Reservas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaPlatos" ADD CONSTRAINT "ReservaPlatos_reservaId_fkey" FOREIGN KEY ("reservaId") REFERENCES "Reservas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservaPlatos" ADD CONSTRAINT "ReservaPlatos_menuPlatoId_fkey" FOREIGN KEY ("menuPlatoId") REFERENCES "MenuPlatos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuPlatos" ADD CONSTRAINT "MenuPlatos_platoId_fkey" FOREIGN KEY ("platoId") REFERENCES "Platos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
