import { AuthenticateUseCase } from '../authenticate.js'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'

export function makeAuthenticateUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)

  return authenticateUseCase
}
