import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma.js'

// Implementando o repositório de usuários usando Prisma
export class PrismaUsersRepository {
  // Método para encontrar um usuário pelo ID
  async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) {
      throw new Error('User not found')
    }
    return user
  }

  // Método para criar um novo usuário
  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    // Retornando o usuário criado
    return user
  }

  // Método para encontrar um usuário pelo e-mail
  async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    // Retornando o usuário encontrado ou null
    return user
  }
}
