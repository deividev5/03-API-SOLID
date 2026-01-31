import { prisma } from '@/lib/prisma.js'
import { Prisma } from '@prisma/client'
export { prisma } from '@/lib/prisma.js'

// Implementando o repositório de usuários usando Prisma
export class PrismaUsersRepository {
  // Método para criar um novo usuário
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    // Retornando o usuário criado
    return user
  }
}
