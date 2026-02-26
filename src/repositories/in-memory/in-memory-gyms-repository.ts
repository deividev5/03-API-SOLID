import { GymsRepository } from '../gyms-repository.js'

import { Gym } from '@prisma/client'

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
}
