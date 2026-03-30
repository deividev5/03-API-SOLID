import { makeGetUserProfileUseCase } from '@/use-cases/factories/make-get-user-profile-use-case.js'
import { FastifyRequest, FastifyReply } from 'fastify'

// Controlador para o endpoint de perfil do usuário
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Criando uma instância do caso de uso para obter o perfil do usuário
  const getUserProfile = makeGetUserProfileUseCase()

  // Executando o caso de uso para obter os dados do perfil do usuário
  const { user } = await getUserProfile.execute({
    userId: request.user.sub,
  })

  // Enviando a resposta com os dados do usuário, omitindo o hash da senha
  reply.send({
    user: {
      ...user,
      password_hash: undefined,
    },
  })
}
