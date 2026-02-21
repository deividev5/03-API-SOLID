import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { GymsRepository } from '@/repositories/gyms-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { CheckIn } from '@prisma/client'

// Definindo a interface para o request do caso de uso de check-in, contendo os dados necessários para criar um check-in
interface CheckInUseCaseRequest {
  userId: string
  gymId: string
  userLatitude: number
  userLongitude: number
}

interface CheckInUseCaseResponse {
  checkIn: CheckIn
}

export class CheckInUseCase {
  // Injetando as dependências dos repositórios de check-ins e de academias no construtor da classe
  constructor(
    private checkInsRepository: CheckInsRepository,
    private gymsRepository: GymsRepository,
  ) {}

  // Método principal para executar o caso de uso de check-in
  async execute({
    userId,
    gymId,
    // Desestruturando os dados do request
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Verificando se a academia existe no banco de dados
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // calculando a distancia entre o usuário e a academia

    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new Error()
    }

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
