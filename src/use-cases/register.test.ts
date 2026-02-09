import { compare } from 'bcryptjs'
import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js'
import { RegisterUseCase } from './register.js'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'

// Variáveis para armazenar o repositório simulado e o caso de uso de autenticação
let usersRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe('Register Use Case', () => {
  // Antes de cada teste, inicializa o repositório simulado e o caso de uso de autenticação
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should register a new user', async () => {
    // Executando o caso de uso de registro
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    // Verificando se o usuário foi criado com um ID válido
    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash the password upon registration', async () => {
    // Executando o caso de uso de registro
    const { user } = await sut.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    })

    // Verificando se a senha foi corretamente hashada
    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    // Espera que a senha esteja corretamente hashada
    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    // Definindo o e-mail a ser usado nos testes
    const email = 'john.doe@example.com'

    // Primeiro registro deve ser bem-sucedido
    await sut.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    // Segundo registro com o mesmo e-mail deve lançar um erro
    await expect(() =>
      sut.execute({
        name: 'John Doe',
        email,
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
