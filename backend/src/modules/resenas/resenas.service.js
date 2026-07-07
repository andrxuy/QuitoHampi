import { supabase } from '../../config/database.js'

export const getByMedico = async (medicoId) => {
  const { data, error } = await supabase
    .from('resenas')
    .select('*')
    .eq('medico_id', medicoId)
    .eq('estado', 'Visible')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const create = async (resenaData) => {
  const { data, error } = await supabase
    .from('resenas')
    .insert([{
      paciente_id: resenaData.pacienteId,
      medico_id: resenaData.medicoId,
      estrellas: resenaData.estrellas,
      comentario: resenaData.comentario,
      estado: 'Visible'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const getAllAdmin = async () => {
  const { data, error } = await supabase
    .from('resenas')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const toggleVisibility = async (id) => {
  const { data: current } = await supabase
    .from('resenas')
    .select('estado')
    .eq('id', id)
    .single()

  const newEstado = current.estado === 'Visible' ? 'Oculta' : 'Visible'

  const { data, error } = await supabase
    .from('resenas')
    .update({ estado: newEstado })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const remove = async (id) => {
  const { error } = await supabase
    .from('resenas')
    .delete()
    .eq('id', id)

  if (error) throw error
  return { success: true }
}
