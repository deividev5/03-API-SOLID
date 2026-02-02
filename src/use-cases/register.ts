import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository.js'

// Definindo a interface para o request do caso de uso
interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  // Injetando o repositório de usuários via construtor
  constructor(private usersRepository: UsersRepository) {}

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    // Hashing da senha antes de salvar
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    // Se o e-mail já estiver registrado, lançar um erro
    if (userWithSameEmail) {
      throw new Error('E-mail already registered.')
    }

    // Criando o novo usuário no banco de dados
    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
