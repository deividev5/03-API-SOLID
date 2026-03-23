import { FastifyRequest, FastifyReply } from 'fastify'

// Controlador para o endpoint de perfil do usuário
export async function profile(request: FastifyRequest, reply: FastifyReply) {
  // Verificando o token JWT para garantir que o usuário está autenticado
  await request.jwtVerify()

  // Exibindo o ID do usuário extraído do token JWT
  console.log(request.user.sub)

  // Retornando as informações do usuário autenticado
  return reply.send({ user: request.user })
}
