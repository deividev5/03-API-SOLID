import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, it, expect, describe } from 'vitest'

describe('Autenticação (e2e)', () => {
  // Antes de cada teste executar, espere a aplicação ficar pronta.
  beforeAll(async () => {
    await app.ready()
  })

  // Depois de cada teste terminar, feche a aplicação.
  afterAll(async () => {
    await app.close()
  })

  it('should be able to authenticate', async () => {
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

    // Vamos testar a rota de profile do usuário passando o token junto par ela ser valida
    const response = await request(app.server)
      .get('/me')
      .set('Authorization', `Bearer ${token}`)
      .send()

    // Esperamos que retorne status code 200 e no objeto user do corpo resposta venha o email
    expect(response.statusCode).toEqual(200)
    expect(response.body.user).toEqual(
      expect.objectContaining({
        email: 'johndoe@example.com',
      }),
    )
  })
})
