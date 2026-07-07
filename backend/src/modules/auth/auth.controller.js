import * as authService from './auth.service.js'
import { supabase } from '../../config/database.js'

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
  const { nombre, apellido, email, password, especialidad, telefono } = req.body
  if (!nombre || !apellido || !email || !password || !especialidad) {
    return res.status(400).json({ error: 'Todos los campos son requeridos' })
  }

  const result = await authService.registerMedico(req.body)
  if (!result.success) {
    return res.status(400).json({ error: result.message })
  }

  return res.status(201).json({ message: 'Registro exitoso. Tu solicitud está pendiente de verificación.', user: result.user })
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
