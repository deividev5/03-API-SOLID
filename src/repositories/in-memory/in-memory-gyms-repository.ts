import { randomUUID } from 'node:crypto'
import { GymsRepository, FindManyNeabyParams } from '../gyms-repository.js'
import { Gym, Prisma } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js'

// Implementação do repositório de academias em memória, que simula o comportamento de um banco de dados para fins de teste
export class InMemoryGymsRepository implements GymsRepository {
  public items: Gym[] = []

  // Método para encontrar uma academia pelo seu ID, retornando a academia encontrada ou null se não for encontrada
  async findById(id: string) {
    const gym = this.items.find((item) => item.id === id)

    // Se a academia não for encontrada, retorna null
    if (!gym) {
      return null
    }

    // Se a academia for encontrada, retorna a academia encontrada
    return gym
  }

  // Método para encontrar academias próximas com base em coordenadas de latitude e longitude, retornando um array de academias próximas
  async findManyNeaby(params: FindManyNeabyParams) {
    // Filtra as academias em memória para encontrar aquelas que estão próximas das coordenadas fornecidas, usando a função de cálculo de distância entre coordenadas
    return this.items.filter((item) => {
      const distance = getDistanceBetweenCoordinates(
        { latitude: params.latitude, longitude: params.longitude },
        {
          latitude: item.latitude.toNumber(),
          longitude: item.longitude.toNumber(),
        },
      )
      // Considera uma academia como próxima se a distância for menor que 10 km
      return distance < 10
    })
  }

  // Método para buscar academias com base em uma consulta de texto e paginação, retornando um array de academias que correspondem à consulta
  async searchMany(query: string, page: number) {
    return this.items
      .filter((item) => item.title.toLowerCase().includes(query.toLowerCase()))
      .slice((page - 1) * 20, page * 20)
  }

  // Método para criar uma nova academia, recebendo os dados da academia
  async createGym(data: Prisma.GymCreateInput) {
    const gym = {
      id: data.id ?? randomUUID(),
      title: data.title,
      description: data.description ?? null,
      phone: data.phone ?? null,
      latitude: new Prisma.Decimal(data.latitude.toString()),
      longitude: new Prisma.Decimal(data.longitude.toString()),
      created_at: new Date(),
    }

    // Adiciona a nova academia ao array de academias em memória
    this.items.push(gym)

    // Retorna a academia criada
    return gym
  }
}
