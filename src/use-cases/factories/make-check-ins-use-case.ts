import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js'
import { CheckInUseCase } from '../check-ins.js'
import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gym-repository.js'

/// Factory para criar uma instância do caso de uso CheckInUseCase
export function makeCheckInsUseCase() {
  const prismaCheckInsRepository = new PrismaCheckInsRepository()
  const gymsRepository = new PrismaGymsRepository()
  const checkInUseCase = new CheckInUseCase(
    prismaCheckInsRepository,
    gymsRepository,
  )

  return checkInUseCase
}
