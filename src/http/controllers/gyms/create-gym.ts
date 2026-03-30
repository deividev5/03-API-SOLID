import { z } from 'zod'
import { makeCreateGymsUseCase } from '@/use-cases/factories/make-create-gyms-use-case.js'
import { FastifyRequest, FastifyReply } from 'fastify'

// Controlador para o endpoint de registro
export async function createGym(request: FastifyRequest, reply: FastifyReply) {
  // Validando os dados de entrada usando Zod
  const createGymBodySchema = z.object({
    title: z.string(),
    description: z.string().nullable(),
    phone: z.string().nullable(),
    latitude: z.number().refine((value) => {
      return Math.abs(value) <= 90
    }),
    longitude: z.number().refine((value) => {
      return Math.abs(value) <= 180
    }),
  })

  // Extraindo os dados validados do corpo da requisição
  const { title, description, phone, latitude, longitude } =
    createGymBodySchema.parse(request.body)

  // Executando o caso de uso de criação de academia

  const createGymsUseCase = makeCreateGymsUseCase()
  await createGymsUseCase.execute({
    title,
    description,
    phone,
    latitude,
    longitude,
    created_at: new Date(),
  })

  // Retornando uma resposta de sucesso
  return reply.status(201).send()
}
