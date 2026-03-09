import { prisma } from '@/lib/prisma.js'
import { CheckIn, Prisma } from '@prisma/client'
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

  // Método par contar o número de check-ins de um usuário específico
  async countByUserId(userId: string) {
    // Contando o número de check-ins para um usuário específico
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })

    // Retornando a contagem de check-ins para o usuário
    return count
  }

  // Método para encontrar muitos check-ins por usuário e página
  async findManyByUserId(userId: string, page: number) {
    // Encontrando muitos check-ins para um usuário específico, paginados por 20 itens por página
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    // Retornando os check-ins encontrados para o usuário e página especificados
    return checkIns
  }

  // Método salvar um check-in atualizado
  async save(data: CheckIn) {
    // Atualizando o check-in no banco de dados usando o Prisma
    const checkin = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })

    // Retornando o check-in atualizado
    return checkin
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
