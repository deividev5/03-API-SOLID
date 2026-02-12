import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory/in-memory-check-ins-repository.js'
import { CheckInUseCase } from './check-ins.js'

// Variáveis para armazenar o repositório simulado e o caso de uso de check-in
let checkInsRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de check-in
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new CheckInUseCase(checkInsRepository)
  })

  it('should check-in a user', async () => {
    // Executando o caso de uso de check-in
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    // Verificando se o check-in foi criado com um ID válido
    expect(checkIn.id).toEqual(expect.any(String))
  })
})
