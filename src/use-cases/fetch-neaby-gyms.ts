import { GymsRepository } from '@/repositories/gyms-repository.js'
import { Gym } from '@prisma/client'

// Definindo a interface para o request do caso de uso
interface FetchNeabyGymsUseCaseRequest {
  latitude: number
  longitude: number
}

// Definindo a interface para a resposta do caso de uso
interface FetchNeabyGymsUseCaseResponse {
  gyms: Gym[]
}

export class FetchNeabyGymsUseCase {
  // Injetando o repositório de gyms via construtor
  constructor(private gymsRepository: GymsRepository) {}

  // Método para executar o caso de uso, recebendo os dados do request e retornando a resposta
  async execute({
    // Desestruturando os dados do request
    latitude,
    longitude,
  }: FetchNeabyGymsUseCaseRequest): Promise<FetchNeabyGymsUseCaseResponse> {
    // Buscando as academias no repositório usando o método searchMany
    const gyms = await this.gymsRepository.findManyNeaby({
      latitude,
      longitude,
    })

    // Retornando as academias encontradas na resposta
    return {
      gyms,
    }
  }
}
