import { supabase } from '../../config/database.js'

export const getAll = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, rol, estado, created_at')
    .eq('rol', 'paciente')

  if (error) throw error
  return data
}

export const getById = async (id) => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, email, rol, estado, created_at')
    .eq('id', id)
    .single()

  if (error) return null
  return data
}

export const update = async (id, updates) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const toggleBlock = async (id) => {
  const { data: current } = await supabase
    .from('usuarios')
    .select('estado')
    .eq('id', id)
    .single()

  const newEstado = current.estado === 'activo' ? 'bloqueado' : 'activo'

  const { data, error } = await supabase
    .from('usuarios')
    .update({ estado: newEstado })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
