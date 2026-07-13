import { supabase } from '../../config/database.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { validarCedula } from '../../utils/validarCedula.js'
import { validarTelefono } from '../../utils/validarTelefono.js'

export const loginUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !user) {
    return { success: false, message: 'Credenciales incorrectas' }
  }

  if (user.estado === 'bloqueado') {
    return { success: false, message: 'Tu cuenta ha sido bloqueada por el administrador' }
  }

  if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
    return { success: false, message: 'Cuenta bloqueada temporalmente. Intenta de nuevo más tarde.' }
  }

  if (user.estado === 'pendiente') {
    return { success: false, message: 'Tu registro está pendiente de verificación' }
  }

  if (user.estado === 'rechazado') {
    return { success: false, message: 'Tu registro de médico ha sido rechazado' }
  }

  const validPassword = user.password.startsWith('$2')
    ? await bcryptjs.compare(password, user.password)
    : password === user.password

  if (!validPassword) {
    const nuevosIntentos = (user.intentos_fallidos || 0) + 1
    const updates = { intentos_fallidos: nuevosIntentos }
    if (nuevosIntentos >= 3) {
      updates.bloqueado_hasta = new Date(Date.now() + 5 * 60 * 1000).toISOString()
    }
    await supabase.from('usuarios').update(updates).eq('id', user.id)
    return { success: false, message: 'Credenciales incorrectas' }
  }

  if (user.intentos_fallidos > 0 || user.bloqueado_hasta) {
    await supabase.from('usuarios').update({ intentos_fallidos: 0, bloqueado_hasta: null }).eq('id', user.id)
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '30m' }
  )

  return { success: true, token, user: { id: user.id, email: user.email, rol: user.rol, estado: user.estado } }
}

export const registerUser = async (userData) => {
  console.log('[SERVICE registerUser] datos recibidos:', { ...userData, password: userData.password ? '***' : undefined })

  if (!userData.cedula) {
    return { success: false, message: 'La cédula es requerida' }
  }

  if (!validarCedula(userData.cedula)) {
    return { success: false, message: 'La cédula ingresada no es válida' }
  }

  const { data: existingEmail } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', userData.email.toLowerCase())
    .single()

  if (existingEmail) {
    return { success: false, message: 'El correo ya está registrado' }
  }

  const { data: existingCedulaPaciente } = await supabase
    .from('pacientes')
    .select('id')
    .eq('cedula', userData.cedula)
    .single()

  const { data: existingCedulaMedico } = await supabase
    .from('medicos')
    .select('id')
    .eq('cedula', userData.cedula)
    .single()

  if (existingCedulaPaciente || existingCedulaMedico) {
    return { success: false, message: 'Ya existe una cuenta registrada con esta cédula' }
  }

  const hashedPassword = await bcryptjs.hash(userData.password, 10)

  const estado = userData.rol === 'medico' ? 'pendiente' : 'activo'

  console.log('[SERVICE] insertando en usuarios...')
  const { data: usuario, error: errUsuario } = await supabase
    .from('usuarios')
    .insert([{
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      rol: userData.rol,
      estado
    }])
    .select()
    .single()

  if (errUsuario) {
    console.log('[SERVICE] ERROR al insertar usuario:', errUsuario.message)
    return { success: false, message: 'Error al registrar usuario: ' + errUsuario.message }
  }

  console.log('[SERVICE] usuario creado:', usuario.id)

  if (userData.rol === 'paciente') {
    console.log('[SERVICE] insertando en pacientes...')
    const { data: paciente, error: errPaciente } = await supabase
      .from('pacientes')
      .insert([{
        usuario_id: usuario.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        cedula: userData.cedula,
        telefono: userData.telefono || null
      }])
      .select()
      .single()

    if (errPaciente) {
      console.log('[SERVICE] ERROR al insertar paciente:', errPaciente.message)
      return { success: false, message: 'Error al registrar datos del paciente: ' + errPaciente.message }
    }

    console.log('[SERVICE] paciente creado:', paciente.id)
    return { success: true, user: { ...usuario, perfil: paciente } }
  }

  if (userData.rol === 'medico') {
    console.log('[SERVICE] insertando en medicos...')
    const { data: medico, error: errMedico } = await supabase
      .from('medicos')
      .insert([{
        usuario_id: usuario.id,
        nombre: userData.nombre,
        apellido: userData.apellido,
        cedula: userData.cedula,
        telefono: userData.telefono || null,
        especialidad: userData.especialidad
      }])
      .select()
      .single()

    if (errMedico) {
      console.log('[SERVICE] ERROR al insertar medico:', errMedico.message)
      return { success: false, message: 'Error al registrar datos del médico: ' + errMedico.message }
    }

    console.log('[SERVICE] medico creado:', medico.id)
    return { success: true, user: { ...usuario, perfil: medico } }
  }

  return { success: true, user: usuario }
}

export const changePassword = async (userId, currentPassword, newPassword) => {
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('password')
    .eq('id', userId)
    .single()

  if (error || !user) {
    return { success: false, message: 'Usuario no encontrado' }
  }

  const valid = user.password.startsWith('$2')
    ? await bcryptjs.compare(currentPassword, user.password)
    : currentPassword === user.password

  if (!valid) {
    return { success: false, message: 'Contraseña actual incorrecta' }
  }

  const hashed = await bcryptjs.hash(newPassword, 10)
  const { error: updateError } = await supabase
    .from('usuarios')
    .update({ password: hashed })
    .eq('id', userId)

  if (updateError) {
    return { success: false, message: 'Error al cambiar contraseña' }
  }

  return { success: true, message: 'Contraseña actualizada correctamente' }
}
