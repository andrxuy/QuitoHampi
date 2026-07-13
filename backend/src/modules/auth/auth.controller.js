import * as authService from './auth.service.js'
import { supabase } from '../../config/database.js'
import { validarTelefono } from '../../utils/validarTelefono.js'

export const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' })
  }

  const result = await authService.loginUser(email, password)
  if (!result.success) {
    return res.status(401).json({ error: result.message })
  }

  return res.json({ token: result.token, user: result.user })
}

export const register = async (req, res) => {
  const { nombre, apellido, email, password, rol, especialidad, telefono, cedula } = req.body
  console.log('[REGISTER] body recibido:', { nombre, apellido, email, password: password ? '***' : undefined, rol, especialidad, telefono, cedula })

  if (!nombre || !apellido || !email || !password || !cedula) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  if (!rol || !['paciente', 'medico'].includes(rol)) {
    return res.status(400).json({ error: 'Rol inválido. Use paciente o medico' })
  }

  if (telefono && !validarTelefono(telefono)) {
    return res.status(400).json({ error: 'El número de teléfono no es válido. Debe ser un celular ecuatoriano (09XXXXXXXX o +5939XXXXXXXX)' })
  }

  if (rol === 'medico' && !especialidad) {
    return res.status(400).json({ error: 'La especialidad es requerida para médicos' })
  }

  const result = await authService.registerUser(req.body)
  if (!result.success) {
    switch (result.message) {
      case 'La cédula ingresada no es válida':
        return res.status(400).json({ error: result.message })
      case 'El correo ya está registrado':
      case 'Ya existe una cuenta registrada con esta cédula':
        return res.status(409).json({ error: result.message })
      default:
        return res.status(500).json({ error: result.message })
    }
  }

  const mensaje = rol === 'medico'
    ? 'Registro exitoso. Tu solicitud está pendiente de verificación.'
    : 'Registro exitoso. Ya puedes iniciar sesión.'

  return res.status(201).json({ message: mensaje, user: result.user })
}

export const forgotPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: 'Email requerido' })
  }

  const { data: user } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (!user) {
    return res.status(404).json({ error: 'No existe una cuenta con ese correo' })
  }

  return res.json({ message: 'Se ha enviado un enlace de recuperación a tu correo' })
}

export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Contraseña actual y nueva requeridas' })
  }

  const result = await authService.changePassword(req.user.id, currentPassword, newPassword)
  if (!result.success) {
    return res.status(400).json({ error: result.message })
  }

  return res.json({ message: result.message })
}
