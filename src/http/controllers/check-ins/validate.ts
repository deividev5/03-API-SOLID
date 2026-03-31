import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { makeValidateCheckInUseCase } from '@/use-cases/factories/make-validate-check-in-use-case.js'

// Controlador para o endpoint de registro
export async function validateCheckIn(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Validando os dados de entrada usando Zod
  const validateCheckInParamsSchema = z.object({
    checkInId: z.uuid(),
  })

  // Extraindo os dados validados dos parâmetros da rota
  const { checkInId } = validateCheckInParamsSchema.parse(request.params)

  // Criando uma instância do caso de uso de validação de check-in
  const validateCheckInUseCase = makeValidateCheckInUseCase()

  await validateCheckInUseCase.execute({
    id: checkInId,
  })

  // Retornando uma resposta de sucesso
  return reply.status(204).send()
}
