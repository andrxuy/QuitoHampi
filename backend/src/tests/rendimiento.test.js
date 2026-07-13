import { jest } from '@jest/globals'

const mockSupabase = { from: jest.fn() }

jest.unstable_mockModule('../config/database.js', () => ({ supabase: mockSupabase }))

const app = (await import('../app.js')).default
const supertest = (await import('supertest')).default
const request = supertest(app)

beforeEach(() => { jest.clearAllMocks() })

describe('RNF-006: GET /api/especialidades < 500ms', () => {
  test('Debe responder en menos de 500 milisegundos', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({
            data: [
              { id: 1, nombre: 'Cardiología', activo: true },
              { id: 2, nombre: 'Pediatría', activo: true }
            ],
            error: null
          }))
        }))
      }))
    }))

    const start = Date.now()
    const res = await request.get('/api/especialidades')
    const duration = Date.now() - start

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(duration).toBeLessThan(500)
  })
})
