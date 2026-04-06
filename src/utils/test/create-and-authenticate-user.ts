import request from 'supertest'
import { FastifyInstance } from 'fastify'

export async function createAndAuthenticateUser(app: FastifyInstance) {
  // Criamos um usuario antes para testa a rota sessions de autenticação
  await request(app.server).post('/users').send({
    name: 'John Doe',
    email: 'johndoe@example.com',
    password: '123456',
  })

  // Eviando o dados de um usuário existente para ter o token de autenticação
  const responseAuth = await request(app.server).post('/sessions').send({
    email: 'johndoe@example.com',
    password: '123456',
  })

  // Pegando o token criado da autenticação
  const { token } = responseAuth.body

  // Retornando o token para ser usado nos testes
  return { token }
}
