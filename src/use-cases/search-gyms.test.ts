import { expect, describe, it, beforeEach, afterEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { SearchGymsUseCase } from './search-gyms.js'

// Variáveis para armazenar a instância do repositório simulado e do caso de uso, que serão inicializadas antes de cada teste
let gymsRepository: InMemoryGymsRepository
let sut: SearchGymsUseCase

describe('Search Gyms Use Case', () => {
  // Configuração inicial para cada teste, criando uma nova instância do repositório simulado e do caso de uso
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()

    sut = new SearchGymsUseCase(gymsRepository)
  })

  // Limpeza após cada teste, esvaziando o array de academias do repositório simulado para garantir que os testes sejam independentes
  afterEach(() => {
    gymsRepository.items = []
  })

  // Teste para verificar se a busca por academias retorna os resultados corretos com base na consulta de texto
  it('should fetch user check-ins history', async () => {
    await gymsRepository.createGym({
      id: 'gym-01',
      title: 'Gym Javascript',
      description: 'Description Test',
      phone: '123456789',
      latitude: -40.7128,
      longitude: -74.006,
      created_at: new Date(),
    })

    await gymsRepository.createGym({
      id: 'gym-02',
      title: 'Gym Typescript',
      description: 'Description Test',
      phone: '123456789',
      latitude: -40.7128,
      longitude: -74.006,
      created_at: new Date(),
    })

    //  Executando o caso de uso para buscar as academias com a consulta "Gym Javascript" e a página 1
    const { gyms } = await sut.execute({
      query: 'Gym Javascript',
      page: 1,
    })

    // Verificando se a busca retornou as academias corretas para a consulta "Gym Javascript", que deve conter apenas a academia "Gym Javascript"
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Gym Javascript' })])
  })
})

// Teste para verificar se a busca por academias retorna os resultados paginados corretamente
it('should fetch paginated user check-ins history', async () => {
  // Criando 22 academias no repositório simulado para testar a paginação
  for (let i = 1; i <= 22; i++) {
    gymsRepository.createGym({
      id: `gym-${i}`,
      title: `Gym Typescript ${i}`,
      description: 'Description Test',
      phone: '123456789',
      latitude: -40.7128,
      longitude: -74.006,
      created_at: new Date(),
    })
  }

  // Executando o caso de uso para buscar as academias com a consulta "Gym Typescript" e a página 2
  const { gyms } = await sut.execute({
    query: 'Gym Typescript',
    page: 2,
  })

  // Verificando se a busca retornou as academias corretas para a página 2, que deve conter as academias de 21 a 22
  expect(gyms).toHaveLength(2)
  expect(gyms).toEqual([
    expect.objectContaining({ title: 'Gym Typescript 21' }),
    expect.objectContaining({ title: 'Gym Typescript 22' }),
  ])
})
