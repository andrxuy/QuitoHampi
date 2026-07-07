import * as medicosService from './medicos.service.js'

export const getAll = async (req, res) => {
  try {
    const { especialidad, lat, lng } = req.query
    const medicos = await medicosService.getVerifiedMedicos({ especialidad, lat, lng })
    return res.json(medicos)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener médicos' })
  }
}

export const getById = async (req, res) => {
  try {
    const medico = await medicosService.getMedicoById(req.params.id)
    if (!medico) {
      return res.status(404).json({ error: 'Médico no encontrado' })
    }
    return res.json(medico)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener médico' })
  }
}

export const getPendientes = async (req, res) => {
  try {
    const pendientes = await medicosService.getPendientes()
    return res.json(pendientes)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener pendientes' })
  }
}

export const verificar = async (req, res) => {
  try {
    const { estado } = req.body
    if (!['Verificado', 'Rechazado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido. Use Verificado o Rechazado' })
    }
    const medico = await medicosService.verificarMedico(req.params.id, estado)
    return res.json(medico)
  } catch (err) {
    return res.status(500).json({ error: 'Error al verificar médico' })
  }
}

export const update = async (req, res) => {
  try {
    const medicoId = parseInt(req.params.id)
    if (req.user.rol !== 'admin' && req.user.id !== medicoId) {
      return res.status(403).json({ error: 'No tienes permiso para editar este perfil' })
    }
    const updated = await medicosService.updateMedico(medicoId, req.body)
    return res.json(updated)
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar médico' })
  }
}
