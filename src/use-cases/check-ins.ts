import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { GymsRepository } from '@/repositories/gyms-repository.js'
import { ResourceNotFoundError } from './errors/resource-not-found-error.js'
import { CheckIn } from '@prisma/client'
import { getDistanceBetweenCoordinates } from '@/utils/get-distance-between-coordinates.js'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-checks-ins-error.js'
import { MaxDistanceError } from './errors/max-distance-error.js'

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
    userLatitude,
    userLongitude,

    // Desestruturando os dados do request
  }: CheckInUseCaseRequest): Promise<CheckInUseCaseResponse> {
    // Verificando se a academia existe no banco de dados
    const gym = await this.gymsRepository.findById(gymId)

    if (!gym) {
      throw new ResourceNotFoundError()
    }

    // calculando a distancia entre o usuário e a academia
    const distance = getDistanceBetweenCoordinates(
      {
        latitude: userLatitude,
        longitude: userLongitude,
      },
      {
        latitude: gym.latitude.toNumber(),
        longitude: gym.longitude.toNumber(),
      },
    )

    // Verificando se a distância entre o usuário e a academia é maior do que a distância máxima permitida para realizar o check-in
    const MAX_DISTANCE_IN_KILOMETERS = 0.1

    // Se a distância for maior do que a distância máxima permitida, lança um erro para indicar que o check-in não pode ser realizado
    if (distance > MAX_DISTANCE_IN_KILOMETERS) {
      throw new MaxDistanceError()
    }

    // Verificando se o usuário já fez check-in na mesma academia no mesmo dia
    const checkInOnSameDay = await this.checkInsRepository.findByUserIdOnDate(
      userId,
      new Date(),
    )

    if (checkInOnSameDay) {
      throw new MaxNumberOfCheckInsError()
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
