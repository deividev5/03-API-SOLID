import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middleware/verify-jwt.js'
import { createGym } from './create-gym.js'

export async function appRoutesGyms(app: FastifyInstance) {
  // Usamos o hook onRequest para aplicar o middleware de verificação JWT a todas as rotas definidas neste controlador
  app.addHook('onRequest', verifyJwt)

  app.post('/gyms', createGym)
}
