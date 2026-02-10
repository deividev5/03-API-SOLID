import { UsersRepository } from '@/repositories/users-repository.js'
import { User, Prisma } from '@prisma/client'

// Repositório de usuários em memória para testes
export class InMemoryUsersRepository implements UsersRepository {
  // Armazenando os usuários em um array
  public items: User[] = []

  // Encontrando um usuário pelo e-mail
  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }
  // Encontrando um usuário pelo ID

  async findById(id: string) {
    const user = this.items.find((item) => item.id === id)

    if (!user) {
      return null
    }

    return user
  }

  // Criando um novo usuário
  async create(data: Prisma.UserCreateInput) {
    const user = {
      id: `user-${Math.random()}`,
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date(),
    }

    this.items.push(user)

    return user
  }
}
