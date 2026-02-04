import { compare } from 'bcryptjs'
import { expect, describe, it } from 'vitest'
import { RegisterUseCase } from './register.js'

describe('Register Use Case', () => {
  it('should hash the password upon registration', async () => {
    // Criando uma instância do caso de uso com um repositório de usuários simulado
    const registerUseCase = new RegisterUseCase({
      async findByEmail() {
        return null
      },
      // Simulando a criação do usuário
      async create(data) {
        return {
          id: 'user-1',
          name: data.name,
          email: data.email,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    // Executando o caso de uso de registro
    const { user } = await registerUseCase.execute({
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
})
