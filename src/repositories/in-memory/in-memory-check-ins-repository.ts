import { CheckInsRepository } from '@/repositories/check-ins-repository.js'
import { CheckIn, Prisma } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import dayjs from 'dayjs'
// Repositório de check-ins em memória para testes
export class InMemoryCheckInsRepository implements CheckInsRepository {
  // Armazenando os check-ins em um array
  public items: CheckIn[] = []

  // Método para encontrar um check-in por usuário e data
  async findByUserIdOnDate(userId: string, date: Date) {
    // Calculando o início e o fim do dia para a data fornecida
    const startOfTheDay = dayjs(date).startOf('date')
    // Calculando o fim do dia para a data fornecida
    const endOfTheDay = dayjs(date).endOf('date')

    // Encontrando um check-in que corresponda ao usuário e que tenha sido criado no mesmo dia
    const checkInOnSameDate = this.items.find((checkIn) => {
      // Verificando se a data de criação do check-in está entre o início e o fim do dia
      const checkInDate = dayjs(checkIn.created_at)
      // Verificando se o check-in ocorreu no mesmo dia, comparando a data do check-in com o início e o fim do dia
      const isOnSameDate =
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay)

      // Verificando se o check-in pertence ao usuário e ocorreu no mesmo dia
      return checkIn.user_id === userId && isOnSameDate
    })

    // Se não encontrar um check-in no mesmo dia, retorna null
    if (!checkInOnSameDate) {
      return null
    }

    // Retorna o check-in encontrado que ocorreu no mesmo dia para o usuário
    return checkInOnSameDate
  }

  // Método para encontrar um check-in por ID
  async findById(id: string) {
    // Filtrando os check-ins para encontrar um que corresponda ao ID fornecido
    const checkIn = this.items.filter((checkIn) => checkIn.id === id)

    // Retornando o check-in encontrado ou null se não for encontrado
    return checkIn ? checkIn[0] : null
  }

  // Método para salvar um check-in, atualizando-o se já existir ou adicionando um novo check-in
  async save(checkIn: CheckIn) {
    // Encontrando o índice do check-in a ser salvo no array de itens
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    // Se o check-in já existir, atualiza o item no array; caso contrário, não faz nada (o check-in será adicionado apenas pelo método create)
    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }

    // Retornando o check-in salvo, seja ele atualizado ou não
    return checkIn
  }

  // Método para contar o número de check-ins de um usuário
  async countByUserId(userId: string) {
    return this.items.filter((checkIn) => checkIn.user_id === userId).length
  }

  async findManyByUserId(userId: string, page: number) {
    // Filtrando os check-ins do usuário e paginando os resultados
    const checkIns = this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)

    // Retornando os check-ins encontrados para o usuário na página solicitada
    return checkIns
  }

  // Criando um novo check-in
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    // Adicionando o check-in criado ao array de itens
    this.items.push(checkIn)

    // Retornando o check-in criado
    return checkIn
  }
}
