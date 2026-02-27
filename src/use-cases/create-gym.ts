import { GymsRepository } from '@/repositories/gyms-repository.js'
import { Gym } from '@prisma/client'

// Definindo a interface para o request do caso de uso
interface CreateGymUseCaseRequest {
  title: string
  description: string | null
  phone: string | null
  latitude: number
  longitude: number
  created_at: Date
}

// Definindo a interface para a resposta do caso de uso
interface CreateGymUseCaseResponse {
  gym: Gym
}

export class CreateGymUseCase {
  // Injetando o repositório de gyms via construtor
  constructor(private gymsRepository: GymsRepository) {}

  // Método para executar o caso de uso, recebendo os dados do request e retornando a resposta
  async execute({
    // Desestruturando os dados do request
    title,
    description,
    phone,
    latitude,
    longitude,
    created_at,
  }: CreateGymUseCaseRequest): Promise<CreateGymUseCaseResponse> {
    // Criando o novo usuário no banco de dados
    const gym = await this.gymsRepository.createGym({
      title,
      description,
      phone,
      latitude,
      longitude,
      created_at,
    })

    // Retornando o usuário criado
    return {
      gym,
    }
  }
}
