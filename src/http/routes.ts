import { FastifyInstance } from 'fastify'
import { register } from '@/http/controllers/register.js'
import { authenticate } from './controllers/authenticate.js'
import { profile } from './controllers/profile.js'
import { verifyJwt } from './middleware/verify-jwt.js'

export async function appRoutes(app: FastifyInstance) {
  // Rota para registrar um novo usuário
  app.post('/users', register)
  // Rota para autenticar um usuário e obter um token JWT
  app.post('/sessions', authenticate)

  // Rota protegida para obter o perfil do usuário autenticado, usando o middleware de verificação JWT
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
