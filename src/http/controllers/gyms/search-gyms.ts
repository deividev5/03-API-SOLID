import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeSearchGymsUseCase } from '@/use-cases/factories/make-search-gyms-use-case.js'

// Controlador para o endpoint de busca
export async function searchGyms(request: FastifyRequest, reply: FastifyReply) {
  // Validando os dados de entrada usando Zod
  const searchGymsQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number(),
  })

  // Extraindo os dados validados do corpo da requisição
  const { query, page } = searchGymsQuerySchema.parse(request.query)

  // Criando uma instância do caso de uso de busca de academias
  const searchGymsUseCase = makeSearchGymsUseCase()

  // Executando o caso de uso com os dados validados
  const { gyms } = await searchGymsUseCase.execute({
    query,
    page,
  })

  // Retornando uma resposta de sucesso
  return reply.status(200).send({
    gyms,
  })
}
