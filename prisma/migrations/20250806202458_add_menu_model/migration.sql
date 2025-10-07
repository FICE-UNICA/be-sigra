/*
  Warnings:

  - You are about to drop the column `elejible` on the `MenuPlato` table. All the data in the column will be lost.
  - You are about to drop the column `fecha` on the `MenuPlato` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[menuId,platoId]` on the table `MenuPlato` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `elegible` to the `MenuPlato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `menuId` to the `MenuPlato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MenuPlato" DROP COLUMN "elejible",
DROP COLUMN "fecha",
ADD COLUMN     "elegible" BOOLEAN NOT NULL,
ADD COLUMN     "menuId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Menu" (
    "id" SERIAL NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Menu_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Menu_fecha_key" ON "Menu"("fecha");

-- CreateIndex
CREATE UNIQUE INDEX "MenuPlato_menuId_platoId_key" ON "MenuPlato"("menuId", "platoId");

-- AddForeignKey
ALTER TABLE "MenuPlato" ADD CONSTRAINT "MenuPlato_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE CASCADE ON UPDATE CASCADE;
