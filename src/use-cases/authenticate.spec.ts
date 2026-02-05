import { hash } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { AuthenticateUseCase } from './authenticate.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'

describe('Authenticate Use Case', () => {
  it('should be able to authenticate ', async () => {
    // Criando uma instância do caso de uso com um repositório de usuários simulado
    const usersRepository = new InMemoryUsersRepository()
    // Criando uma instância do caso de uso de autenticação
    const sut = new AuthenticateUseCase(usersRepository)

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
    // Criando uma instância do caso de uso com um repositório de usuários simulado
    const usersRepository = new InMemoryUsersRepository()
    // Criando uma instância do caso de uso de autenticação
    const sut = new AuthenticateUseCase(usersRepository)

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
    // Criando uma instância do caso de uso com um repositório de usuários simulado
    const usersRepository = new InMemoryUsersRepository()
    // Criando uma instância do caso de uso de autenticação
    const sut = new AuthenticateUseCase(usersRepository)

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
