import { jest } from '@jest/globals'
import bcryptjs from 'bcryptjs'

const mockSupabase = { from: jest.fn() }

jest.unstable_mockModule('../config/database.js', () => ({ supabase: mockSupabase }))

const { loginUser, registerUser } = await import('../modules/auth/auth.service.js')

beforeEach(() => { mockSupabase.from.mockReset() })

describe('RNF-001: bcrypt encripta contraseña al registrar', () => {
  test('Debe almacenar la contraseña como hash bcrypt', async () => {
    let storedPassword = ''
    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: null, error: { message: 'not found' } })) })) })),
      insert: jest.fn((data) => { if (data[0].password) storedPassword = data[0].password; return { select: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: { id: 2, ...data[0] }, error: null })) })) } })
    })

    const result = await registerUser({
      email: 'dr@test.com', password: 'MiPass123',
      nombre: 'Test', apellido: 'Dr', especialidad: 'Cardiología',
      cedula: '1700000001', rol: 'medico', telefono: '0991234567'
    })

    expect(result.success).toBe(true)
    expect(storedPassword).toMatch(/^\$2[aby]\$\d+\$/)
    const coincide = await bcryptjs.compare('MiPass123', storedPassword)
    expect(coincide).toBe(true)
  })
})

describe('RNF-002: Bloqueo tras 3 intentos fallidos', () => {
  test('Debe contar intentos y bloquear al alcanzar 3', async () => {
    const usuario = { id: 5, email: 'dr@fallos.com', password: 'RealPass', rol: 'medico', estado: 'activo', intentos_fallidos: 0, bloqueado_hasta: null }
    let payloadRecibido = null

    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({ eq: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: usuario, error: null })) })) })),
      update: jest.fn((data) => { payloadRecibido = data; Object.assign(usuario, data); return { eq: jest.fn(() => ({ select: jest.fn(() => ({ single: jest.fn(() => Promise.resolve({ data: usuario, error: null })) })) })) } })
    })

    const r1 = await loginUser('dr@fallos.com', 'Fallo1')
    expect(r1.success).toBe(false)
    expect(r1.message).toBe('Credenciales incorrectas')
    expect(payloadRecibido).not.toBeNull()
    expect(payloadRecibido).toEqual({ intentos_fallidos: 1 })

    const r2 = await loginUser('dr@fallos.com', 'Fallo2')
    expect(r2.success).toBe(false)
    expect(payloadRecibido).toEqual({ intentos_fallidos: 2 })

    const r3 = await loginUser('dr@fallos.com', 'Fallo3')
    expect(r3.success).toBe(false)
    expect(payloadRecibido.intentos_fallidos).toBe(3)
    expect(payloadRecibido.bloqueado_hasta).toBeTruthy()

    const r4 = await loginUser('dr@fallos.com', 'RealPass')
    expect(r4.success).toBe(false)
    expect(r4.message).toMatch(/bloqueada temporalmente/i)
  })
})
