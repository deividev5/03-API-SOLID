import { FastifyInstance } from 'fastify'
import { verifyJwt } from '../../middleware/verify-jwt.js'
import { historyCheckIns } from './history.js'
import { getUserMetrics } from './metrics.js'
import { createCheckIn } from './create.js'
import { validateCheckIn } from './validate.js'

export async function appRoutesCheckIns(app: FastifyInstance) {
  // Usamos o hook onRequest para aplicar o middleware de verificação JWT a todas as rotas definidas neste controlador
  app.addHook('onRequest', verifyJwt)

  app.get('/check-ins/history', historyCheckIns)
  app.get('/check-ins/metrics', getUserMetrics)

  app.post('/gyms/:gymId/check-ins', createCheckIn)
  app.patch('/check-ins/:checkInId/validate', validateCheckIn)
}
