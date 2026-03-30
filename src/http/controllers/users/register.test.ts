import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, it, expect, describe } from 'vitest'

describe('Registro (e2e)', () => {
  // Antes de cada teste executar, espere a aplicação ficar pronta.
  beforeAll(async () => {
    await app.ready()
  })

  // Depois de cada teste terminar, feche a aplicação.
  afterAll(async () => {
    await app.close()
  })

  it('should be able to register', async () => {
    // Eviando um os dado para a rota post, para fazer um registro de usuário
    const response = await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    // Esperamos que o staus code da nossa solicitação seja de 201(deu certo)
    expect(response.statusCode).toEqual(201)
  })
})
