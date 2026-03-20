import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-in-repository.js'
import { ValidateCheckInCase } from '../validate-check-in.js'

/// Factory para criar uma instância do caso de uso ValidateCheckInCase
export function makeValidateCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInsRepository()
  const validateCheckInCase = new ValidateCheckInCase(checkInsRepository)

  return validateCheckInCase
}
