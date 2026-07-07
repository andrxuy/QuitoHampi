import * as pacientesService from './pacientes.service.js'

export const getAll = async (req, res) => {
  try {
    const pacientes = await pacientesService.getAll()
    return res.json(pacientes)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener pacientes' })
  }
}

export const getById = async (req, res) => {
  try {
    const pacienteId = parseInt(req.params.id)
    if (req.user.rol !== 'admin' && req.user.id !== pacienteId) {
      return res.status(403).json({ error: 'No tienes permiso' })
    }
    const paciente = await pacientesService.getById(pacienteId)
    if (!paciente) return res.status(404).json({ error: 'Paciente no encontrado' })
    return res.json(paciente)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener paciente' })
  }
}

export const update = async (req, res) => {
  try {
    const pacienteId = parseInt(req.params.id)
    if (req.user.rol !== 'admin' && req.user.id !== pacienteId) {
      return res.status(403).json({ error: 'No tienes permiso' })
    }
    const updated = await pacientesService.update(pacienteId, req.body)
    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar paciente' })
  }
}

export const toggleBlock = async (req, res) => {
  try {
    const paciente = await pacientesService.toggleBlock(parseInt(req.params.id))
    return res.json(paciente)
  } catch (err) {
    return res.status(500).json({ error: 'Error al cambiar estado' })
  }
}
