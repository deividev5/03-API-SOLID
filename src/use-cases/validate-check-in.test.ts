import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { ValidateCheckInCase } from './validate-check-in.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { LateCheckInValidationError } from './errors/late-check-in-validation-error.js'

// Variáveis para armazenar o repositório simulado e o caso de uso de validação de check-in
let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInCase

describe('Check-In Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de validação de check-in
  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInCase(checkInsRepository)

    // Configura o ambiente de teste para usar timers falsos, permitindo simular o tempo durante os testes
    vi.useFakeTimers()
  })

  // Após cada teste, restaura os timers reais para evitar interferências entre os testes
  afterEach(() => {
    // Restaura os timers reais após cada teste para evitar interferências entre os testes
    vi.useRealTimers()
  })

  it('should be able to validate a check-in', async () => {
    // Adicionando um check-in ao repositório simulado para ser validado durante o teste
    checkInsRepository.items.push({
      id: 'check-in-02',
      gym_id: 'gym-01',
      validated_at: null,
      user_id: 'user-01',
      created_at: new Date(),
    })

    // Executando o caso de uso de validação de check-in
    const { checkIn } = await sut.execute({
      id: 'check-in-02',
    })

    // Verificando se o check-in foi validado corretamente, ou seja, se a propriedade validated_at foi preenchida com uma data
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate a check-in that does not exist', async () => {
    // Executando o caso de uso de validação de check-in com um ID de check-in que não existe no repositório simulado
    await expect(() => {
      return sut.execute({
        id: 'non-existing-check-in',
      })
      // Esperando que a execução do caso de uso lance um erro do tipo ResourceNotFoundError, indicando que o check-in não foi encontrado
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate the check-in after 20 minutes of the creation', async () => {
    // Configurando o ambiente de teste para usar uma data específica, permitindo simular o tempo durante os testes
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40))

    // Adicionando um check-in ao repositório simulado para ser validado durante o teste
    checkInsRepository.items.push({
      id: 'check-in-02',
      gym_id: 'gym-01',
      validated_at: null,
      user_id: 'user-01',
      created_at: new Date(),
    })

    // Avançando o tempo em 21 minutos para simular a situação em que a validação do check-in está sendo feita fora do prazo permitido
    vi.advanceTimersByTime(1000 * 60 * 21)

    // Executando o caso de uso de validação de check-in com um ID de check-in que existe no repositório simulado, mas a validação está sendo feita fora do prazo permitido
    await expect(() => {
      return sut.execute({
        id: 'check-in-02',
      })
    }).rejects.toBeInstanceOf(LateCheckInValidationError)
  })
})
