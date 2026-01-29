import fastify from 'fastify'
import { appRoutes } from '@/http/routes.js'

// Create a Fastify instance
export const app = fastify()

app.register(appRoutes)
