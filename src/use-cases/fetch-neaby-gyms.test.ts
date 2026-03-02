import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { FetchNeabyGymsUseCase } from './fetch-neaby-gyms.js'

// Variáveis para armazenar a instância do repositório simulado e do caso de uso, que serão inicializadas antes de cada teste
let gymsRepository: InMemoryGymsRepository
let sut: FetchNeabyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  // Configuração inicial para cada teste, criando uma nova instância do repositório simulado e do caso de uso
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new FetchNeabyGymsUseCase(gymsRepository)
  })

  // Limpeza após cada teste, esvaziando o array de academias do repositório simulado para garantir que os testes sejam independentes
  afterEach(() => {
    gymsRepository.items = []
  })

  // Teste para verificar se a busca por academias próximas retorna os resultados corretos com base nas coordenadas de latitude e longitude
  it('should fetch nearby gyms', async () => {
    // Criando duas academias no repositório simulado, uma próxima e outra distante, para testar a funcionalidade de busca por academias próximas
    await gymsRepository.createGym({
      id: 'gym-01',
      title: 'Near Gym',
      description: 'Description Test',
      phone: '123456789',
      latitude: -12.620994,
      longitude: -38.9918429,
      created_at: new Date(),
    })

    await gymsRepository.createGym({
      id: 'gym-02',
      title: 'Far Gym',
      description: 'Description Test',
      phone: '123456789',
      latitude: -12.3619702,
      longitude: -38.3694379,
      created_at: new Date(),
    })

    // Executando o caso de uso para buscar as academias próximas com as coordenadas de latitude -12.620994 e longitude -38.9918429
    const { gyms } = await sut.execute({
      latitude: -12.620994,
      longitude: -38.9918429,
    })

    // Verificando se a busca retornou as academias corretas para as coordenadas fornecidas, que deve conter apenas a academia "Near Gym" e não conter a academia "Far Gym"
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
