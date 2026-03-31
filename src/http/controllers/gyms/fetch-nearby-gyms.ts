import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-neaby-gyms-use-case.js'

// Controlador para o endpoint de busca
export async function fetchNearbyGyms(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Validando os dados de entrada usando Zod
  const fetchNearbyGymsQuerySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  // Extraindo os dados validados do corpo da requisição
  const { latitude, longitude } = fetchNearbyGymsQuerySchema.parse(request.body)

  // Criando uma instância do caso de uso de busca de academias
  const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()
  // Executando o caso de uso com os dados validados
  await fetchNearbyGymsUseCase.execute({
    latitude,
    longitude,
  })

  // Retornando uma resposta de sucesso
  return reply.status(200).send()
}
