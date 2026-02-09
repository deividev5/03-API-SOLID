import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

// Variáveis para armazenar o repositório simulado e o caso de uso de autenticação
let usersRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe('Authenticate Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de autenticação
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })
  it('should be able to authenticate ', async () => {
    // Criando um usuário no repositório simulado
    await usersRepository.create({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password_hash: await hash('123456', 6),
    })

    // Executando o caso de uso de autenticação
    const { user } = await sut.execute({
      email: 'john.doe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    // Executando o caso de uso de autenticação com um email incorreto
    await expect(
      () =>
        sut.execute({
          email: 'johndoe@example.com',
          password: '123456',
        }),
      // Verificando se lança o erro de credenciais inválidas
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('should not be able to authenticate with wrong password', async () => {
    // Criando um usuário no repositório simulado
    await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // Executando o caso de uso de autenticação com uma senha incorreta
    await expect(
      () =>
        sut.execute({
          email: 'johndoe@example.com',
          password: '1234567',
        }),
      // Verificando se lança o erro de credenciais inválidas
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
