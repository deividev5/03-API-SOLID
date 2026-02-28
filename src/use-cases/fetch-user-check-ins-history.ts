import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { CheckIn } from '@prisma/client'

// Definindo as interfaces para o request e response do caso de uso de fetchUserCheckInsHistory
interface fetchUserCheckInsHistoryUseCaseRequest {
  userId: string
  page: number
}

interface CheckInUseCaseResponse {
  checkIns: CheckIn[]
}

export class FetchUserCheckInsHistoryUseCase {
  // Injetando o repositório de check-ins no construtor da classe
  constructor(private checkInsRepository: CheckInsRepository) {}

  // Método execute, responsável por executar a lógica do caso de uso de fetchUserCheckInsHistory
  async execute({
    userId,
    page,
    // Desestruturando os dados do request
  }: fetchUserCheckInsHistoryUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Buscando os check-ins do usuário no repositório, utilizando o método findManyByUserId, passando o userId e a página solicitada
    const checkIns = await this.checkInsRepository.findManyByUserId(
      userId,
      page,
    )

    // Retornando os check-ins encontrados para o usuário, paginados de acordo com a página solicitada
    return {
      checkIns,
    }
  }
}
