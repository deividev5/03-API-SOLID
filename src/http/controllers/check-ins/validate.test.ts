import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, it, expect, describe } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.ts'
import { prisma } from '@/lib/prisma.ts'

describe('Validar um check-in', () => {
  // Antes de cada teste executar, espere a aplicação ficar pronta.
  beforeAll(async () => {
    await app.ready()
  })

  // Depois de cada teste terminar, feche a aplicação.
  afterAll(async () => {
    await app.close()
  })

  it('should be able to validate a check-in', async () => {
    // Criando um usuário e autenticando ele para pegar o token de acesso
    const { token } = await createAndAuthenticateUser(app)

    // Fazendo uma solicitação POST para criar uma nova academia, passando o token de acesso no header e os dados da academia no corpo da solicitação
    const gym = await request(app.server)
      .post('/gyms')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'JavaScript Gym',
        description: 'A melhor academia para aprender JavaScript',
        phone: '11999999999',
        latitude: -40.7128,
        longitude: -74.006,
        created_at: new Date(),
      })

    // Fazendo uma solicitação POST para criar um novo check-in, passando o token de acesso no header e os dados do check-in no corpo da solicitação
    const createCheckInResponse = await request(app.server)
      .post(`/gyms/${gym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -40.7128,
        longitude: -74.006,
      })

    // Extraindo o ID do check-in criado a partir da resposta da solicitação de criação de check-in
    const checkInId = createCheckInResponse.body.checkIn.id

    // Fazendo uma solicitação PATCH para validar o check-in criado, passando o token de acesso no header e o ID do check-in na URL
    const response = await request(app.server)
      .patch(`/check-ins/${checkInId}/validate`)
      .set('Authorization', `Bearer ${token}`)
      .send()

    // Esperamos que o staus code da nossa solicitação seja de 204(deu certo)
    expect(response.statusCode).toEqual(204)

    // A prova real: buscar no banco
    const checkInValidate = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkInId,
      },
    })

    // Esperamos que o campo validated_at do check-in seja uma data, ou seja, que ele tenha sido validado
    expect(checkInValidate.validated_at).toEqual(expect.any(Date))
  })
})
