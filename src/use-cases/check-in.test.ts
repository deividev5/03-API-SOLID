import { expect, describe, it, beforeEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository.js'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository.js'
import { Decimal } from '@prisma/client/runtime/library.js'
import { CheckInUseCase } from './check-ins.js'
import { afterEach } from 'node:test'

// Variáveis para armazenar o repositório simulado e o caso de uso de check-in
let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe('Check-In Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de check-in
  beforeEach(() => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    // Adiciona uma academia ao repositório simulado para ser usada nos testes
    gymsRepository.items.push({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-49.6401091),
      created_at: new Date(),
    })

    // Configura o ambiente de teste para usar timers falsos, permitindo simular o tempo durante os testes
    vi.useFakeTimers()
  })

  // Após cada teste, restaura os timers reais para evitar interferências entre os testes
  afterEach(() => {
    // Restaura os timers reais após cada teste para evitar interferências entre os testes
    vi.useRealTimers()
  })

  it('should check-in a user', async () => {
    // Executando o caso de uso de check-in
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    // Verificando se o check-in foi criado com um ID válido
    expect(checkIn.id).toEqual(expect.any(String))
  })

  // Teste para verificar se um usuário não pode fazer check-in duas vezes no mesmo dia
  it('should not able to check-in twice in the same day', async () => {
    // Simulando o tempo para garantir que ambos os check-ins ocorram no mesmo dia
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    // Realizando o primeiro check-in
    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    // Tentando realizar o segundo check-in no mesmo dia e esperando que lance um erro
    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -27.2092052,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  // Teste para verificar se um usuário pode fazer check-in em dias diferentes
  it('should be able to check-in on different days', async () => {
    // Simulando o tempo para o primeiro check-in
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    // Simulando o tempo para o segundo check-in no dia seguinte
    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: 'gym-01',
      userId: 'user-01',
      userLatitude: -27.2092052,
      userLongitude: -49.6401091,
    })

    // Verificando se o segundo check-in foi criado com um ID válido, confirmando que o usuário pode fazer check-in em dias diferentes
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('Should not be able to check-in on distance greater than 100 meters', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-27.2092052),
      longitude: new Decimal(-38.9680911),
      created_at: new Date(),
    })

    await expect(() =>
      sut.execute({
        gymId: 'gym-01',
        userId: 'user-01',
        userLatitude: -12.5986426,
        userLongitude: -49.6401091,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
