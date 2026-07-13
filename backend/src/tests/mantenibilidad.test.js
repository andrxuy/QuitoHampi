import { jest } from '@jest/globals'

jest.unstable_mockModule('../config/database.js', () => ({ supabase: { from: jest.fn() } }))

const app = (await import('../app.js')).default
const supertest = (await import('supertest')).default
const request = supertest(app)

describe('RNF-016: Errores con formato { error: "mensaje" }', () => {
  test('Login sin email debe devolver 400 con { error: string }', async () => {
    const res = await request.post('/api/auth/login').send({ password: 'Admin123' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: expect.any(String) })
  })
})
