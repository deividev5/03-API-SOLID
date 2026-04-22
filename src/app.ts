import fastify from 'fastify'

import { ZodError, z } from 'zod'
import { env } from './env/index.js'
import fastifyJwt from '@fastify/jwt'
import { appRoutesUsers } from './http/controllers/users/routes.js'
import { appRoutesGyms } from './http/controllers/gyms/routes.js'
import { appRoutesCheckIns } from './http/controllers/check-ins/route.js'
import fastifyCookie from '@fastify/cookie'
// Create a Fastify instance
export const app = fastify()

app.register(appRoutesUsers)
app.register(appRoutesGyms)
app.register(appRoutesCheckIns)

app.register(fastifyCookie)

// register the JWT plugin with the secret from environment variables
app.register(fastifyJwt, {
  cookie: {
    cookieName: 'refreshToken',
    signed: false, // We will handle signing manually
  },
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '10m', // Token will expire in 10 minutes
  },
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
