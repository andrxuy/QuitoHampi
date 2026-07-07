import { supabase } from '../../config/database.js'

export const getVerifiedMedicos = async ({ especialidad }) => {
  let query = supabase
    .from('medicos')
    .select('*')

  if (especialidad) {
    query = query.ilike('especialidad', `%${especialidad}%`)
  }

  const { data, error } = await query
  if (error) throw error

  return data
}

export const getMedicoById = async (id) => {
  const { data: medico, error } = await supabase
    .from('medicos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return null
  return medico
}

export const getPendientes = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, rol, estado, created_at')
    .eq('rol', 'medico')
    .eq('estado', 'pendiente')

  if (error) throw error
  return data
}

export const verificarMedico = async (id, estado) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ estado })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const updateMedico = async (id, updates) => {
  const { data, error } = await supabase
    .from('medicos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
