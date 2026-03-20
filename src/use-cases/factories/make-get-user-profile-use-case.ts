import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { GetUserProfileUseCase } from '../get-user-profile.js'

/// Factory para criar uma instância do caso de uso GetUserProfileUseCase
export function makeGetUserProfileUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const getUserProfileUseCase = new GetUserProfileUseCase(prismaUsersRepository)

  return getUserProfileUseCase
}
