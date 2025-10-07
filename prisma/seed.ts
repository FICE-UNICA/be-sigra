import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()
const DEPT_NAME = 'Administradores'

async function main() {
  const dept = await prisma.departamento.create({
    data: { nombre: DEPT_NAME }
  })
  console.log(`Departamento "${DEPT_NAME}" creado con id=${dept.id}`)

  const passwordHash = await bcrypt.hash(
    process.env.ADMIN_PWD ?? 'Admin123',
    10
  )

  const admin = await prisma.usuario.create({
    data: {
      departamentoId: dept.id,
      nombre: 'Admin',
      username: 'admin',
      password: passwordHash,    
      role: 'ADMIN'
    }
  })
  console.log(`Usuario "admin" creado con id=${admin.id}`)
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
