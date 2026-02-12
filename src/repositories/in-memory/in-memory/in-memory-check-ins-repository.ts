import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'

// Repositório de check-ins em memória para testes
export class InMemoryCheckInsRepository implements CheckInsRepository {
  // Armazenando os check-ins em um array

  public items: CheckIn[] = []

  // Criando um novo check-in
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    // Adicionando o check-in criado ao array de itens
    this.items.push(checkIn)

    // Retornando o check-in criado
    return checkIn
  }
}
