import { jest } from '@jest/globals'

jest.unstable_mockModule('../config/database.js', () => ({ supabase: { from: jest.fn() } }))

const app = (await import('../app.js')).default
const supertest = (await import('supertest')).default
const request = supertest(app)

describe('RNF-014: Health check retorna 200 OK', () => {
  test('GET /api/health debe devolver status 200 con status ok', async () => {
    const res = await request.get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
    expect(res.body).toHaveProperty('timestamp')
  })
})
