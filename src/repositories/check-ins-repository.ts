import { CheckIn, Prisma } from '@prisma/client'

// Interface do repositório de check-ins, definindo os métodos necessários para gerenciar check-ins
export interface CheckInsRepository {
  create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
}
