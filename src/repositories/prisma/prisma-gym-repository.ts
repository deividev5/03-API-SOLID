import { prisma } from '@/lib/prisma.js'
import { Prisma } from '@prisma/client'

// Implementação do repositório de academias em memória, que simula o comportamento de um banco de dados para fins de teste
export class InMemoryGymsRepository {
  // Método para encontrar uma academia pelo seu ID, retornando a academia encontrada ou null se não for encontrada
  async findById(id: string) {
    const gym = prisma.gym.findUnique({
      where: {
        id,
      },
    })

    // Se a academia não for encontrada, retorna null
    if (!gym) {
      return null
    }

    // Se a academia for encontrada, retorna a academia encontrada
    return gym
  }

  // Método para criar uma nova academia, recebendo os dados da academia a ser criada
  async createGym(data: Prisma.GymCreateInput) {
    const gym = await prisma.gym.create({
      data,
    })

    // Retorna a academia criada
    return gym
  }
}
