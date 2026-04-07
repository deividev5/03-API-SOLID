import request from 'supertest'
import { app } from '@/app.js'
import { afterAll, beforeAll, it, expect, describe, vi } from 'vitest'
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user.ts'

describe('Obter historico de check-ins', () => {
  // Antes de cada teste executar, espere a aplicação ficar pronta.
  beforeAll(async () => {
    await app.ready()
  })

  // Depois de cada teste terminar, feche a aplicação.
  afterAll(async () => {
    await app.close()
  })

  it('should be able to get check-ins history', async () => {
    // Criando um usuário e autenticando ele para pegar o token de acesso
    const { token } = await createAndAuthenticateUser(app)

    // Configura uma data específica para o teste, garantindo que os check-ins sejam criados em dias diferentes
    vi.setSystemTime(new Date(2024, 0, 20, 8, 0, 0))

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

    // Criando dois check-ins para o usuário autenticado, ambos na academia criada anteriormente, mas em dias diferentes
    await request(app.server)
      .post(`/gyms/${gym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -40.7128,
        longitude: -74.006,
      })

    // "Viaja" para o dia seguinte
    vi.setSystemTime(new Date(2024, 0, 21, 8, 0, 0))

    await request(app.server)
      .post(`/gyms/${gym.body.gym.id}/check-ins`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        latitude: -40.7128,
        longitude: -74.006,
      })

    // Volta o relógio ao normal após as criações
    vi.useRealTimers()

    // Fazendo uma solicitação GET para o endpoint de histórico de check-ins, passando o token de acesso no header e a página como query
    const response = await request(app.server)
      .get('/check-ins/history')
      .query({ page: 1 })
      .set('Authorization', `Bearer ${token}`)
      .send()

    // Esperamos que o staus code da nossa solicitação seja de 201(deu certo)
    expect(response.statusCode).toEqual(200)
    expect(response.body.checkIns).toHaveLength(2) // Verifica se retornou 2
    expect(response.body.checkIns).toEqual([
      expect.objectContaining({ gym_id: gym.body.gym.id }),
      expect.objectContaining({ gym_id: gym.body.gym.id }),
    ])
  })
})
