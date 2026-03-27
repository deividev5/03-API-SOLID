import { z } from 'zod'
import { FastifyRequest, FastifyReply } from 'fastify'
import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error.js'
import { makeAuthenticateUseCase } from '@/use-cases/factories/make-authenticate-use-case.js'
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
    // Criando uma instância do caso de uso de autenticação
    const authenticateUseCase = makeAuthenticateUseCase()
    const { user } = await authenticateUseCase.execute({
      email,
      password,
    })

    // Gerando um token JWT para o usuário autenticado
    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    // Retornando o token JWT na resposta
    return reply.status(200).send({ token })
    // Tratando erros específicos do caso de uso
  } catch (err) {
    // Se o erro for de credenciais inválidas, retornar 401
    if (err instanceof InvalidCredentialsError) {
      return reply.status(401).send({ message: err.message })
    }

    throw err
  }
}
