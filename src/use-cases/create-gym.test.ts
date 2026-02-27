import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { CreateGymUseCase } from './create-gym.js'

// Variáveis para armazenar o repositório simulado e o caso de uso de academia
let gymsRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de academia
  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should create a new gym', async () => {
    // Executando o caso de uso de criação de academia
    const { gym } = await sut.execute({
      title: 'Gym Test',
      description: 'Description Test',
      phone: '123456789',
      latitude: -40.7128,
      longitude: -74.006,
      created_at: new Date(),
    })

    // Verificando se o usuário foi criado com um ID válido
    expect(gym.id).toEqual(expect.any(String))
  })
})
