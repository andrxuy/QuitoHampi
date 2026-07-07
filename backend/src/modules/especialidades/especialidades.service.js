import { supabase } from '../../config/database.js'

export const getAll = async () => {
  const { data, error } = await supabase
    .from('especialidades')
    .select('*')
    .eq('activo', true)
    .order('nombre')

  if (error) throw error
  return data
}

export const create = async (nombre) => {
  const { data, error } = await supabase
    .from('especialidades')
    .insert([{ nombre, activo: true, created_at: new Date().toISOString() }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const update = async (id, nombre) => {
  const { data, error } = await supabase
    .from('especialidades')
    .update({ nombre })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const toggleActive = async (id) => {
  const { data: current } = await supabase
    .from('especialidades')
    .select('activo')
    .eq('id', id)
    .single()

  const { data, error } = await supabase
    .from('especialidades')
    .update({ activo: !current.activo })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}
