import { supabase } from '../../config/database.js'

export const getByMedico = async (medicoId, fechaInicio, fechaFin) => {
  let query = supabase
    .from('citas')
    .select('*')
    .eq('medico_id', medicoId)

  if (fechaInicio) query = query.gte('fecha', fechaInicio)
  if (fechaFin) query = query.lte('fecha', fechaFin)

  const { data, error } = await query.order('fecha')
  if (error) throw error
  return data
}

export const getByPaciente = async (pacienteId) => {
  const { data, error } = await supabase
    .from('citas')
    .select('*')
    .eq('paciente_id', pacienteId)
    .order('fecha', { ascending: false })

  if (error) throw error
  return data
}

export const create = async (citaData) => {
  const { data, error } = await supabase
    .from('citas')
    .insert([{
      paciente_id: citaData.pacienteId,
      medico_id: citaData.medicoId,
      fecha: citaData.fecha,
      hora: citaData.hora,
      tipo: citaData.tipo,
      estado: 'confirmada'
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const cancel = async (id) => {
  const { data, error } = await supabase
    .from('citas')
    .update({ estado: 'cancelada' })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const setRestDay = async (medicoId, dia) => {
  try {
    await supabase
      .from('citas')
      .update({ estado: 'cancelada' })
      .eq('medico_id', medicoId)
      .eq('fecha', dia)
  } catch (e) {}

  return { success: true }
}
