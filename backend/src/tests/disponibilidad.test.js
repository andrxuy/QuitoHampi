import { jest } from '@jest/globals'

jest.unstable_mockModule('../config/database.js', () => ({
  supabase: { from: jest.fn() }
}))

const app = (await import('../app.js')).default
const supertest = (await import('supertest')).default
const request = supertest(app)

describe('RNF-014: Health check endpoint', () => {
  test('GET /api/health debe devolver 200 OK con status ok', async () => {
    const res = await request.get('/api/health')

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('status', 'ok')
    expect(res.body).toHaveProperty('timestamp')
  })

  test('El timestamp debe ser una fecha ISO válida', async () => {
    const res = await request.get('/api/health')

    const timestamp = new Date(res.body.timestamp)
    expect(timestamp instanceof Date).toBe(true)
    expect(isNaN(timestamp.getTime())).toBe(false)
  })
})
