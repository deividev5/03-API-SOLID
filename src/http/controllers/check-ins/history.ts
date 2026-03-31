import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchUserCheckInsHistoryUseCase } from '@/use-cases/factories/make-fetch-user-check-ins-history-use-case.js'

// Controlador para o endpoint de busca
export async function historyCheckIns(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Validando os dados de entrada usando Zod
  const HistoryCheckInsQuerySchema = z.object({
    page: z.coerce.number(),
  })

  // Extraindo os dados validados do corpo da requisição
  const { page } = HistoryCheckInsQuerySchema.parse(request.query)

  // Criando uma instância do caso de uso de busca de histórico de check-ins
  const historyCheckInsUseCase = makeFetchUserCheckInsHistoryUseCase()

  // Executando o caso de uso com os dados validados
  const { checkIns } = await historyCheckInsUseCase.execute({
    userId: request.user.sub,
    page,
  })

  //  Retornando uma resposta de sucesso com os check-ins encontrados
  return reply.status(200).send({
    checkIns,
  })
}
