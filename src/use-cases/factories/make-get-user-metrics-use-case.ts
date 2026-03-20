import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js'
import { GetUserMetricsUseCase } from '../get-user-metrics.js'

/// Factory para criar uma instância do caso de uso GetUserMetricsUseCase
export function makeGetUserMetricsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const getUserMetricsUseCase = new GetUserMetricsUseCase(
    prismaCheckInsRepository,
  )

  return getUserMetricsUseCase
}
