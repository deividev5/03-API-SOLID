import { randomUUID } from 'node:crypto'
import { GymsRepository } from '../gyms-repository.js'
import { Gym, Prisma } from '@prisma/client'

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
