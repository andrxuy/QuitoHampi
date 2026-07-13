import { jest } from '@jest/globals'

const mockSupabase = {
  from: jest.fn()
}

jest.unstable_mockModule('../config/database.js', () => ({
  supabase: mockSupabase
}))

const app = (await import('../app.js')).default
const supertest = (await import('supertest')).default
const request = supertest(app)

beforeEach(() => {
  jest.clearAllMocks()
})

describe('RNF-006: GET /api/especialidades < 500ms', () => {
  test('Debe responder en menos de 500ms', async () => {
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
    expect(duration).toBeLessThan(500)
  })
})

describe('RNF-007: GET /api/medicos < 1 segundo', () => {
  test('Debe responder en menos de 1000ms', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        ilike: jest.fn(() => Promise.resolve({
          data: [
            { id: 1, nombre: 'Juan', apellido: 'Pérez', especialidad: 'Cardiología' }
          ],
          error: null
        })),
        _default: jest.fn(() => Promise.resolve({
          data: [
            { id: 1, nombre: 'Juan', apellido: 'Pérez', especialidad: 'Cardiología' }
          ],
          error: null
        }))
      }))
    }))

    const start = Date.now()
    const res = await request.get('/api/medicos')
    const duration = Date.now() - start

    expect(res.status).toBe(200)
    expect(duration).toBeLessThan(1000)
  })
})

describe('RNF-008: POST /api/auth/login < 500ms', () => {
  test('Debe responder en menos de 500ms (incluso con credenciales inválidas)', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: { message: 'Not found', code: 'PGRST116' }
          }))
        }))
      }))
    }))

    const start = Date.now()
    const res = await request.post('/api/auth/login').send({
      email: 'inexistente@test.com',
      password: 'Cualquier123'
    })
    const duration = Date.now() - start

    expect(res.status).toBe(401)
    expect(duration).toBeLessThan(500)
  })
})
