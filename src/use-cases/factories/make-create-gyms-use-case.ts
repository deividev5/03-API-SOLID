import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository.js'
import { CreateGymUseCase } from '../create-gym.js'

/// Factory para criar uma instância do caso de uso CreateGymUseCase
export function makeCreateGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const createGymUseCase = new CreateGymUseCase(prismaGymsRepository)

  return createGymUseCase
}
