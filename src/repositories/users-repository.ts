import { Prisma, User } from '@prisma/client'

// Interface do repositório de usuários, definindo os métodos necessários para a autenticação
export interface UsersRepository {
  findByEmail(email: string): Promise<User | null>
  findById(id: string): Promise<User | null>
  create(data: Prisma.UserCreateInput): Promise<User>
}
