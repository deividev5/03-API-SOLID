import { FastifyRequest, FastifyReply } from 'fastify'
import { makeGetUserMetricsUseCase } from '@/use-cases/factories/make-get-user-metrics-use-case.js'

// Controlador para o endpoint de busca
export async function getUserMetrics(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Criando uma instância do caso de uso das metricas do usuário
  const getUserMetricsUseCase = makeGetUserMetricsUseCase()

  // Executando o caso de uso com os dados validados
  const { checkIns } = await getUserMetricsUseCase.execute({
    userId: request.user.sub,
  })

  // Retornando uma resposta de sucesso e as métricas do usuário
  return reply.status(200).send({
    checkIns,
  })
}
