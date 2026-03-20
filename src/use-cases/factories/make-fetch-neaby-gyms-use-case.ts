import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository.js'
import { FetchNeabyGymsUseCase } from '../fetch-neaby-gyms.js'

/// Factory para criar uma instância do caso de uso FetchNeabyGymsUseCase
export function makeFetchNearbyGymsUseCase() {
  const prismaGymsRepository = new PrismaGymsRepository()
  const fetchNearbyGymsUseCase = new FetchNeabyGymsUseCase(prismaGymsRepository)

  return fetchNearbyGymsUseCase
}
