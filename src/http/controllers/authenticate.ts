import { z } from 'zod'
import { AuthenticateUseCase } from '@/use-cases/authenticate.js'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js'
// Controlador para o endpoint de autenticação
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  // Validando os dados de entrada usando Zod
  const authenticateBodySchema = z.object({
    email: z.email(),
    password: z.string().min(6),
  })

  // Extraindo os dados validados do corpo da requisição
  const { email, password } = authenticateBodySchema.parse(request.body)

  // Executando o caso de uso de autenticação
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const authenticateUseCase = new AuthenticateUseCase(prismaUsersRepository)
    await authenticateUseCase.execute({
      email,
      password,
    })
    // Tratando erros específicos do caso de uso
  } catch (err) {
    // Se o erro for de credenciais inválidas, retornar 401
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }

  // Retornando uma resposta de sucesso
  return reply.status(201).send()
}
