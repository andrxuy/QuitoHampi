import { supabase } from '../../config/database.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const loginUser = async (email, password) => {
  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !user) {
    return { success: false, message: 'Credenciales incorrectas' }
  }

  if (user.estado === 'bloqueado' || user.bloqueado_hasta) {
    return { success: false, message: 'Tu cuenta ha sido bloqueada por el administrador' }
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
    return { success: false, message: 'Credenciales incorrectas' }
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, rol: user.rol },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  return { success: true, token, user: { id: user.id, email: user.email, rol: user.rol, estado: user.estado } }
}

export const registerMedico = async (userData) => {
  const { data: existing } = await supabase
    .from('usuarios')
    .select('id')
    .eq('email', userData.email.toLowerCase())
    .single()

  if (existing) {
    return { success: false, message: 'El correo ya está registrado' }
  }

  const hashedPassword = await bcryptjs.hash(userData.password, 10)

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{
      email: userData.email.toLowerCase(),
      password: hashedPassword,
      rol: 'medico',
      estado: 'pendiente'
    }])
    .select()
    .single()

  if (error) {
    return { success: false, message: 'Error al registrar: ' + error.message }
  }

  return { success: true, user: data }
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
