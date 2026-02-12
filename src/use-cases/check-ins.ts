import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { CheckIn } from '@prisma/client'

// Definindo a interface para o request do caso de uso de check-in, contendo os dados necessários para criar um check-in
interface CheckInUseCaseRequest {
  userId: string
  gymId: string
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  // Injetando o repositório de check-ins via construtor
  constructor(private checkInsRepository: CheckInsRepository) {}

  // Método principal para executar o caso de uso de check-in
  async execute({
    userId,
    gymId,
    // Desestruturando os dados do request
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Criando o novo check-in no banco de dados
    const checkIn = await this.checkInsRepository.create({
      user_id: userId,
      gym_id: gymId,
    })

    // Retornando o check-in criado
    return {
      checkIn,
    }
  }
}
