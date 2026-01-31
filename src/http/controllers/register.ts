import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register.js'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma-users-repository.js'

// Controlador para o endpoint de registro
export async function register(request: FastifyRequest, reply: FastifyReply) {
  // Validando os dados de entrada usando Zod
  const createUserBodySchema = z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(6),
  })

  // Extraindo os dados validados do corpo da requisição
  const { name, email, password } = createUserBodySchema.parse(request.body)

  // Chamando o caso de uso de registro
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)
    await registerUseCase.execute({
      name,
      email,
      password,
    })
  } catch (error) {
    // Se ocorrer um erro (como e-mail já registrado), retornar conflito
    return reply.status(409).send(error)
  }

  // Retornando uma resposta de sucesso
  return reply.status(201).send()
}
