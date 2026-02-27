import { prisma } from '@/lib/prisma.js'
import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'

// Repositório de check-ins em memória para testes
export class InMemoryCheckInsRepository {
  // Método para encontrar um check-in por usuário e data
  async findByUserIdOnDate(userId: string, date: Date) {
    // Calculando o início e o fim do dia para a data fornecida
    const startOfTheDay = dayjs(date).startOf('date')

    // Calculando o fim do dia para a data fornecida
    const endOfTheDay = dayjs(date).endOf('date')

    // Encontrando um check-in que corresponda ao usuário e que tenha sido criado no mesmo dia
    const checkInOnSameDate = prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endOfTheDay.toDate(),
        },
      },
    })

    // Se não encontrar um check-in no mesmo dia, retorna null
    if (!checkInOnSameDate) {
      return null
    }

    // Retorna o check-in encontrado que ocorreu no mesmo dia para o usuário
    return checkInOnSameDate
  }

  // Criando um novo check-in
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    // Criando um novo check-in no banco de dados usando o Prisma
    const checkIn = await prisma.checkIn.create({
      data,
    })

    // Retornando o check-in criado
    return checkIn
  }
}
