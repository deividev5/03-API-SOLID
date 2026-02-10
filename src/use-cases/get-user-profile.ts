import { UsersRepository } from '@/repositories/users-repository.js'
import { User } from '@prisma/client'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'

// Interfaces para a requisição e resposta do caso de uso de obter perfil de usuário
interface GetUserProfileUseCaseRequest {
  userId: string
}

interface GetUserProfileUseCaseResponse {
  user: User
}

// Caso de uso para obter o perfil de um usuário
export class GetUserProfileUseCase {
  // Injetando o repositório de usuários no construtor
  constructor(private usersRepository: UsersRepository) {}

  // Método para executar o caso de uso
  async execute({
    userId,
    // Desestruturando o userId da requisição
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    // Verificando se o usuário foi encontrado, caso contrário, lançando um erro de recurso não encontrado
    if (!user) {
      throw new ResourceNotFoundError()
    }

    //  Retornando o perfil do usuário encontrado
    return {
      user,
    }
  }
}
