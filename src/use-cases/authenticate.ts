import { UsersRepository } from '@/repositories/users-repository.js'
import { InvalidCredentialsError } from './errors/invalid-credentials-error.js'
import { User } from '@prisma/client'
import { compare } from 'bcryptjs'

// DTOs (Data Transfer Objects)
interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

// Resposta DTO
interface AuthenticateUseCaseResponse {
  user: User
}

// Caso de uso para autenticação
export class AuthenticateUseCase {
  // Injeção de dependência do repositório de usuários
  constructor(private usersRepository: UsersRepository) {}

  // Método para executar a autenticação
  async execute({
    email,
    password,
    // Desestruturação dos dados de entrada
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    // Busca o usuário pelo email
    const user = await this.usersRepository.findByEmail(email)

    // Verifica se o usuário existe
    if (!user) {
      throw new InvalidCredentialsError()
    }

    // Compara a senha fornecida com a senha armazenada (hash)
    const passordMatch = await compare(password, user.password_hash)

    // Se as senhas não coincidirem, lança um erro de credenciais inválidas
    if (!passordMatch) {
      throw new InvalidCredentialsError()
    }

    // Se a autenticação for bem-sucedida, retorna o usuário autenticado
    return {
      user,
    }
  }
}
