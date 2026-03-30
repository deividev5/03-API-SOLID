import fastify from 'fastify'

import { ZodError, z } from 'zod'
import { env } from './env/index.js'
import fastifyJwt from '@fastify/jwt'
import { appRoutesUsers } from './http/controllers/users/routes.js'
import { appRoutesGyms } from './http/controllers/gyms/routes.js'

// Create a Fastify instance
export const app = fastify()

app.register(appRoutesUsers)
app.register(appRoutesGyms)

// register the JWT plugin with the secret from environment variables
app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
})

// Global error handler for the application
app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: z.treeifyError(error) })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Here we should log to a external tool like DataDog/NewRelic/Sentry
  }

  return reply.status(500).send({ message: 'Internal server error.' })
})
