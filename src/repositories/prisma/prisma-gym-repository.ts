import { prisma } from '@/lib/prisma.js'
import { Gym, Prisma } from '@prisma/client'
import {
  FindManyNeabyParams,
  GymsRepository,
} from '@/repositories/gyms-repository.js'

// Implementação do repositório de academias em memória, que simula o comportamento de um banco de dados para fins de teste
export class PrismaGymsRepository implements GymsRepository {
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

  // Método para encontrar academias próximas com base em coordenadas de latitude e longitude, utilizando uma consulta SQL para calcular a distância entre as academias e as coordenadas fornecidas, retornando uma lista de academias próximas
  async findManyNeaby({ latitude, longitude }: FindManyNeabyParams) {
    const gyms = await prisma.$queryRaw<Gym[]>`
    SELECT * FROM gyms
    WHERE (6371 * acos(
      cos(radians(${latitude})) * cos(radians(latitude)) *
      cos(radians(longitude) - radians(${longitude})) +
      sin(radians(${latitude})) * sin(radians(latitude))
    )) < 10
  `

    return gyms
  }

  // Método para buscar academias com base em uma consulta de texto e paginação, retornando uma lista de academias que correspondem à consulta
  async searchMany(query: string, page: number) {
    // Busca academias no banco de dados que correspondam à consulta de texto, utilizando o método findMany do Prisma para filtrar as academias com base no título que contém a consulta
    const gyms = await prisma.gym.findMany({
      where: {
        title: {
          contains: query,
        },
      },
    })
    // Retorna as academias encontradas, aplicando a paginação para limitar o número de academias retornadas por página (20 academias por página)
    return gyms.slice((page - 1) * 20, page * 20)
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
