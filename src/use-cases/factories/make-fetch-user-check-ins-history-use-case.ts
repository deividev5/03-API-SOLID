import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js'
import { FetchUserCheckInsHistoryUseCase } from '../fetch-user-check-ins-history.js'

/// Factory para criar uma instância do caso de uso FetchUserCheckInsHistoryUseCase
export function makeFetchUserCheckInsHistoryUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsHistoryUseCase = new FetchUserCheckInsHistoryUseCase(
    prismaCheckInsRepository,
  )

  return fetchUserCheckInsHistoryUseCase
}
