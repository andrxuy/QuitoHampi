import { jest } from '@jest/globals'

let consoleLogSpy

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
  consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {})
})

afterEach(() => {
  consoleLogSpy.mockRestore()
})

describe('RNF-016: Respuestas de error con estructura { error: "mensaje" }', () => {
  test('Login sin email devuelve { error: string }', async () => {
    const res = await request.post('/api/auth/login').send({ password: 'Admin123' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: expect.any(String) })
  })

  test('Login sin contraseña devuelve { error: string }', async () => {
    const res = await request.post('/api/auth/login').send({ email: 'admin@quitohampi.com' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: expect.any(String) })
  })

  test('Registro incompleto devuelve { error: string }', async () => {
    const res = await request.post('/api/auth/register').send({ email: 'test@test.com' })

    expect(res.status).toBe(400)
    expect(res.body).toEqual({ error: expect.any(String) })
  })

  test('Credenciales inválidas devuelven { error: string }', async () => {
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

    const res = await request.post('/api/auth/login').send({
      email: 'noexiste@test.com',
      password: 'Cualquier123'
    })

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: expect.any(String) })
  })

  test('Endpoint protegido sin token devuelve { error: string }', async () => {
    const res = await request.get('/api/medicos/pendientes')

    expect(res.status).toBe(401)
    expect(res.body).toEqual({ error: expect.any(String) })
  })
})

describe('RNF-017: No hay console.log en código de producción', () => {
  test('Los archivos de servicio no deben usar console.log', async () => {
    const fs = await import('fs')
    const path = await import('path')
    const { fileURLToPath } = await import('url')

    const __dirname = path.default.dirname(fileURLToPath(import.meta.url))
    const srcDir = path.default.resolve(__dirname, '..')

    const serviceDirs = ['modules/auth', 'modules/medicos', 'modules/pacientes', 'modules/citas', 'modules/especialidades', 'modules/resenas']

    for (const dir of serviceDirs) {
      const fullDir = path.default.join(srcDir, dir)
      if (!fs.default.existsSync(fullDir)) continue
      const files = fs.default.readdirSync(fullDir).filter(f => f.endsWith('.service.js'))
      for (const file of files) {
        const content = fs.default.readFileSync(path.default.join(fullDir, file), 'utf-8')
        const lines = content.split('\n')
        const consoleLines = lines.filter(l => l.includes('console.log'))
        expect(consoleLines.length).toBe(0)
      }
    }
  })
})
