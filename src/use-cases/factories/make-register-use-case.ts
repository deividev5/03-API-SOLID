import { RegisterUseCase } from '../register.js'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'

/// Factory para criar uma instância do caso de uso RegisterUseCase
export function makeRegisterUseCase() {
  const prismaUsersRepository = new PrismaUsersRepository()
  const registerUseCase = new RegisterUseCase(prismaUsersRepository)

  return registerUseCase
}
