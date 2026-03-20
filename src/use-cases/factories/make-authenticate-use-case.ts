import { AuthenticateUseCase } from '../authenticate.js'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'

/// Factory para criar uma instância do caso de uso AuthenticateUseCase
export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

  return authenticateUseCase
}
