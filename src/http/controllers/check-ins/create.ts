import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeCheckInsUseCase } from '@/use-cases/factories/make-check-ins-use-case.js'

// Controlador para o endpoint de registro
export async function createCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Validando os dados de entrada usando Zod
  const createCheckInParamsSchema = z.object({
    gymId: z.uuid(),
  })

  const createCheckInBodySchema = z.object({
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  // Extraindo os dados validados do corpo da requisição
  const { latitude, longitude } = createCheckInBodySchema.parse(request.body)

  // Extraindo os dados validados dos parâmetros da rota
  const { gymId } = createCheckInParamsSchema.parse(request.params)

  // Criando uma instância do caso de uso de check-in
  const createCheckInUseCase = makeCheckInsUseCase()
  await createCheckInUseCase.execute({
    gymId,
    userId: request.user.sub,
    userLatitude: latitude,
    userLongitude: longitude,
  })

  // Retornando uma resposta de sucesso
  return reply.status(201).send()
}
