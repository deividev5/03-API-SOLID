import { Gym, Prisma } from '@prisma/client'

// Definindo a interface para os parâmetros de busca de academias próximas
// Usamos a interface para definir os parâmetros de latitude e longitude necessários para encontrar academias próximas.
export interface FindManyNeabyParams {
  latitude: number
  longitude: number
}

// Definindo a interface para o repositório de academias
export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNeaby(params: FindManyNeabyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  createGym(data: Prisma.GymCreateInput): Promise<Gym>
}
