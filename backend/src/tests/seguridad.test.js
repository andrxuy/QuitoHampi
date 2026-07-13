import { jest } from '@jest/globals'

const mockSupabase = { from: jest.fn() }

jest.unstable_mockModule('../config/database.js', () => ({
  supabase: mockSupabase
}))

const app = (await import('../app.js')).default
const supertest = (await import('supertest')).default
const request = supertest(app)

// Helper: builds a chainable supabase query mock
const queryChain = (result) => {
  const chain = { select: jest.fn(() => chain), eq: jest.fn(() => chain), ilike: jest.fn(() => chain), gte: jest.fn(() => chain), lte: jest.fn(() => chain), order: jest.fn(() => Promise.resolve(result)), single: jest.fn(() => Promise.resolve(result)), limit: jest.fn(() => Promise.resolve(result)), insert: jest.fn(() => chain), update: jest.fn(() => chain), delete: jest.fn(() => chain) }
  return chain
}

// Helper: setup mock for a single successful login user lookup
const mockUserLookup = (user) => {
  mockSupabase.from.mockImplementation((table) => {
    if (table === 'usuarios') {
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: user, error: null }))
          }))
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            select: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({ data: {}, error: null }))
            }))
          }))
        }))
      }
    }
    return queryChain({ data: [], error: null })
  })
}

const adminUser = { id: 1, email: 'admin@quitohampi.com', password: 'Admin123', rol: 'admin', estado: 'activo', intentos_fallidos: 0, bloqueado_hasta: null }

beforeEach(() => { jest.clearAllMocks() })

// ─── RNF-001 ───
describe('RNF-001: Encriptación de contraseñas con bcrypt', () => {
  test('Debe generar un hash bcrypt al registrar un médico', async () => {
    let insertedPassword = null
    mockSupabase.from.mockImplementation((table) => {
      if (table !== 'usuarios') return queryChain({ data: [], error: null })
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'not found', code: 'PGRST116' } }))
          }))
        })),
        insert: jest.fn((data) => {
          insertedPassword = data[0].password
          return { select: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: { id: 2, email: data[0].email, password: data[0].password, rol: 'medico', estado: 'pendiente' }, error: null })) })) }
        })
      }
    })

    const authService = await import('../modules/auth/auth.service.js')
    const result = await authService.registerMedico({ email: 'test@medico.com', password: 'MiPassword123', nombre: 'Test', apellido: 'Medico', especialidad: 'Cardiología' })

    expect(result.success).toBe(true)
    expect(insertedPassword).toMatch(/^\$2[aby]\$/)
  })
})

// ─── RNF-002 ───
describe('RNF-002: Bloqueo tras 3 intentos fallidos (5 minutos)', () => {
  test('Debe incrementar intentos_fallidos en cada fallo', async () => {
    const user = { ...adminUser, id: 7, email: 'test@fallos.com', rol: 'medico', intentos_fallidos: 0 }
    let updatePayload = null
    mockSupabase.from.mockImplementation((table) => {
      if (table !== 'usuarios') return queryChain({ data: [], error: null })
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: user, error: null }))
          }))
        })),
        update: jest.fn((payload) => {
          updatePayload = payload
          return { eq: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: {}, error: null })) })) })) }
        })
      }
    })

    const result = await (await import('../modules/auth/auth.service.js')).loginUser('test@fallos.com', 'ClaveIncorrecta')
    expect(result.success).toBe(false)
    expect(updatePayload).toEqual({ intentos_fallidos: 1 })
  })

  test('Debe bloquear al alcanzar 3 intentos fallidos', async () => {
    const user = { ...adminUser, id: 7, email: 'test@fallos.com', rol: 'medico', intentos_fallidos: 2 }
    let updatePayload = null
    mockSupabase.from.mockImplementation((table) => {
      if (table !== 'usuarios') return queryChain({ data: [], error: null })
      return {
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => Promise.resolve({ data: user, error: null }))
          }))
        })),
        update: jest.fn((payload) => {
          updatePayload = payload
          return { eq: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: {}, error: null })) })) })) }
        })
      }
    })

    const result = await (await import('../modules/auth/auth.service.js')).loginUser('test@fallos.com', 'ClaveIncorrecta')
    expect(result.success).toBe(false)
    expect(updatePayload.intentos_fallidos).toBe(3)
    expect(updatePayload.bloqueado_hasta).toBeTruthy()
  })

  test('Debe rechazar login si la cuenta está bloqueada temporalmente', async () => {
    const user = { ...adminUser, id: 7, email: 'test@fallos.com', rol: 'medico', intentos_fallidos: 3, bloqueado_hasta: new Date(Date.now() + 60000).toISOString() }
    mockUserLookup(user)

    const result = await (await import('../modules/auth/auth.service.js')).loginUser('test@fallos.com', 'Correcta123')
    expect(result.success).toBe(false)
    expect(result.message).toMatch(/bloqueada temporalmente/i)
  })
})

// ─── RNF-003 ───
describe('RNF-003: Control de acceso por roles', () => {
  test('Debe devolver 403 si un paciente intenta acceder a endpoint de admin', async () => {
    const patientUser = { ...adminUser, id: 7, email: 'paciente@test.com', password: 'Pass123', rol: 'paciente' }
    mockUserLookup(patientUser)

    const loginRes = await request.post('/api/auth/login').send({ email: 'paciente@test.com', password: 'Pass123' })
    const token = loginRes.body.token
    jest.clearAllMocks()

    const res = await request.get('/api/medicos/pendientes').set('Authorization', `Bearer ${token}`)
    expect(res.status).toBe(403)
  })
})

// ─── RNF-004 ───
describe('RNF-004: Expiración de sesión por inactividad', () => {
  test('El token JWT debe tener expiración de 30 minutos', async () => {
    mockUserLookup(adminUser)

    const loginRes = await request.post('/api/auth/login').send({ email: 'admin@quitohampi.com', password: 'Admin123' })
    const token = loginRes.body.token

    const jwt = (await import('jsonwebtoken')).default
    const decoded = jwt.decode(token)
    const diffMinutes = (decoded.exp - decoded.iat) / 60

    expect(diffMinutes).toBeGreaterThanOrEqual(29)
    expect(diffMinutes).toBeLessThanOrEqual(31)
  })
})

// ─── RNF-005 ───
describe('RNF-005: Rechazar archivos mayores a 3MB', () => {
  test('Debe rechazar payload mayor a 3MB con error 413 o 400', async () => {
    const largePayload = { data: 'x'.repeat(4 * 1024 * 1024) }
    const res = await request.post('/api/auth/login').send(largePayload)
    expect([400, 413]).toContain(res.status)
  })
})

// ─── RNF-009 ───
describe('RNF-009: Errores con mensajes claros si faltan campos', () => {
  test('Debe devolver 400 con mensaje claro si falta email en login', async () => {
    const res = await request.post('/api/auth/login').send({ password: 'Admin123' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
    expect(typeof res.body.error).toBe('string')
    expect(res.body.error.length).toBeGreaterThan(0)
  })

  test('Debe devolver 400 si falta contraseña en login', async () => {
    const res = await request.post('/api/auth/login').send({ email: 'admin@quitohampi.com' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })

  test('Debe devolver 400 si faltan campos en registro', async () => {
    const res = await request.post('/api/auth/register').send({ email: 'test@test.com' })
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty('error')
  })
})

// ─── RNF-010 ───
describe('RNF-010: Respuestas en JSON válido con Content-Type correcto', () => {
  test('GET /api/especialidades debe devolver Content-Type application/json', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          order: jest.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
    const res = await request.get('/api/especialidades')
    expect(res.status).toBe(200)
    expect(res.headers['content-type']).toMatch(/json/)
  })

  test('POST /api/auth/login con credenciales inválidas debe devolver JSON', async () => {
    mockSupabase.from.mockImplementation(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'Not found' } }))
        }))
      }))
    }))
    const res = await request.post('/api/auth/login').send({ email: 'noexiste@test.com', password: 'x' })
    expect(res.status).toBe(401)
    expect(res.headers['content-type']).toMatch(/json/)
    expect(res.body).toHaveProperty('error')
  })
})
