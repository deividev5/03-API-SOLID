import { FastifyInstance } from 'fastify'
import { register } from '@/http/controllers/users/register.js'
import { authenticate } from './authenticate.js'
import { profile } from './profile.js'
import { verifyJwt } from '../../middleware/verify-jwt.js'

export async function appRoutesUsers(app: FastifyInstance) {
  // Rota para registrar um novo usuário
  app.post('/users', register)
  // Rota para autenticar um usuário e obter um token JWT
  app.post('/sessions', authenticate)

  // Rota protegida para obter o perfil do usuário autenticado, usando o middleware de verificação JWT
  app.get('/me', { onRequest: [verifyJwt] }, profile)
}
