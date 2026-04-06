import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, it, expect, describe } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.ts'

describe('Buscar academias proximas', () => {
  // Antes de cada teste executar, espere a aplicação ficar pronta.
  beforeAll(async () => {
    await app.ready()
  })

  // Depois de cada teste terminar, feche a aplicação.
  afterAll(async () => {
    await app.close()
  })

  it('should be able to fetch nearby gyms', async () => {
    // Criando um usuário e autenticando ele para pegar o token de acesso
    const { token } = await createAndAuthenticateUser(app)

    // Fazendo uma solicitação POST para criar uma nova academia, passando o token de acesso no header e os dados da academia no corpo da solicitação
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'A melhor academia para aprender JavaScript',
        phone: '11999999999',
        latitude: -12.620994,
        longitude: -38.9918429,
        created_at: new Date(),
      })

    // Fazendo uma solicitação POST para criar uma nova academia, passando o token de acesso no header e os dados da academia no corpo da solicitação
    await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'TypeScript Gym',
        description: 'A melhor academia para aprender TypeScript',
        phone: '11999999999',
        latitude: -12.3619702,
        longitude: -38.3694379,
        created_at: new Date(),
      })

    const response = await request(app.server)
      .get('/gyms/nearby')
      .query({
        latitude: -12.620994,
        longitude: -38.9918429,
      })
      .set('Authorization', `Bearer ${token}`)
      .send()

    // Esperamos que o staus code da nossa solicitação seja de 201(deu certo)
    expect(response.statusCode).toEqual(200)
    expect(response.body.gyms).toHaveLength(1)
    expect(response.body.gyms).toEqual([
      expect.objectContaining({
        title: 'JavaScript Gym',
      }),
    ])
  })
})
