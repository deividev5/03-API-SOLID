import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository.js'
import { SearchGymsUseCase } from '../search-gyms.js'

/// Factory para criar uma instância do caso de uso SearchGymsUseCase
export function makeSearchGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const searchGymsUseCase = new SearchGymsUseCase(prismaGymsRepository)

  return searchGymsUseCase
}
