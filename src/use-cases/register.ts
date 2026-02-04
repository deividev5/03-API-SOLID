import { hash } from 'bcryptjs'
import { UsersRepository } from '@/repositories/users-repository.js'
import { User } from '@prisma/client'
import { UserAlreadyExistsError } from './errors/user-already-exists-error.js'

// Definindo a interface para o request do caso de uso
interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  // Injetando o repositório de usuários via construtor
  constructor(private usersRepository: UsersRepository) {}

  // Método principal para executar o caso de uso de registro
  async execute({
    name,
    email,
    password,
    // Desestruturando os dados do request
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    // Hashing da senha antes de salvar
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    // Se o e-mail já estiver registrado, lançar um erro
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    // Criando o novo usuário no banco de dados
    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    // Retornando o usuário criado
    return {
      user,
    }
  }
}
