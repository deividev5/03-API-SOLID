import { CheckInsRepository } from '@/repositories/check-ins-repository.js'

// Definindo as interfaces para o request e response do caso de uso de getUserMetrics
interface getUserMetricsUseCaseRequest {
  userId: string
}

interface CheckInUseCaseResponse {
  checkIns: number
}

export class GetUserMetricsUseCase {
  // Injetando o repositório de check-ins no construtor da classe
  constructor(private checkInsRepository: CheckInsRepository) {}

  // Método execute, responsável por executar a lógica do caso de uso de getUserMetrics
  async execute({
    userId,
    // Desestruturando os dados do request
  }: getUserMetricsUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Contando o número de check-ins do usuário utilizando o método countByUserId do repositório de check-ins
    const checkIns = await this.checkInsRepository.countByUserId(userId)
    // Retornando o número de check-ins do usuário
    return {
      checkIns,
    }
  }
}
