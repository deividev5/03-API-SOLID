import { Gym, Prisma } from '@prisma/client'

// Definindo a interface para o repositório de academias
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  searchMany(query: string, page: number): Promise<Gym[]>
  createGym(data: Prisma.GymCreateInput): Promise<Gym>
}
