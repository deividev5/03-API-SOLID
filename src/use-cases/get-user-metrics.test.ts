import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { GetUserMetricsUseCase } from './get-user-metrics.js'

// Variáveis para armazenar o repositório simulado e o caso de uso de check-in
let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get User Metrics Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de check-in
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()

    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  // Após cada teste, limpa os itens do repositório simulado
  afterEach(() => {
    checkInsRepository.items = []
  })

  it('should get user metrics', async () => {
    // Criando dois check-ins para o usuário 'user-01' no repositório simulado
    await checkInsRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    await checkInsRepository.create({
      gym_id: 'gym-02',
      user_id: 'user-01',
    })

    // Executando o caso de uso de getUserMetrics para o usuário 'user-01' e armazenando a resposta
    const { checkIns } = await sut.execute({
      userId: 'user-01',
    })

    // Verificando se o número de check-ins retornado é igual a 2, que é o número de check-ins criados para o usuário 'user-01'
    expect(checkIns).toEqual(2)
  })
})
