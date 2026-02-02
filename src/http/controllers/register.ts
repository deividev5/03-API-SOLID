import { z } from 'zod'
import { RegisterUseCase } from '@/use-cases/register.js'
import { FastifyRequest, FastifyReply } from 'fastify'
import { PrismaUsersRepository } from '@/repositories/prisma/prisma-users-repository.js'
import { UserAlreadyExistsError } from '@/use-cases/errors/user-already-exists-error.js'

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

  // Executando o caso de uso de registro
  try {
    const prismaUsersRepository = new PrismaUsersRepository()
    const registerUseCase = new RegisterUseCase(prismaUsersRepository)
    await registerUseCase.execute({
      name,
      email,
      password,
    })
    // Tratando erros específicos do caso de uso
  } catch (err) {
    // Se o erro for de usuário já existente, retornar 409
    if (err instanceof UserAlreadyExistsError) {
      return reply.status(409).send({ message: err.message })
    }

    throw err
  }

  // Retornando uma resposta de sucesso
  return reply.status(201).send()
}
