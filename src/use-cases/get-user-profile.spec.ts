import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { ResourceNotFoundError } from '@/use-cases/errors/resource-not-found-error.js'
import { GetUserProfileUseCase } from '@/use-cases/get-user-profile.js'
import { hash } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'

// Variáveis para o repositório de usuários e o caso de uso
let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

// Descrevendo o teste para o caso de uso de obter perfil de usuário
describe('Get User Profile Use Case', () => {
  // Antes de cada teste, inicializando o repositório de usuários e o caso de uso
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  // Teste para verificar se é possível obter o perfil de um usuário
  it('should be able to get user profile', async () => {
    // Criando um usuário para o teste
    const createdUser = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    // Executando o caso de uso para obter o perfil do usuário criado
    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    // Verificando se o perfil do usuário foi obtido corretamente
    expect(user.name).toEqual('John Doe')
  })

  // Teste para verificar se o caso de uso lança um erro quando o ID do usuário não existe
  it('should not be able to get user profile with wrong id', async () => {
    // Verificando se o caso de uso lança um erro do tipo ResourceNotFoundError quando o ID do usuário não existe
    expect(() =>
      sut.execute({
        userId: 'non-existing-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
