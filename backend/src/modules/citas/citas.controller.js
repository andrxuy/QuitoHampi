import * as citasService from './citas.service.js'

export const getByMedico = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query
    const citas = await citasService.getByMedico(req.params.medicoId, fechaInicio, fechaFin)
    return res.json(citas)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener citas' })
  }
}

export const getByPaciente = async (req, res) => {
  try {
    const citas = await citasService.getByPaciente(req.params.pacienteId)
    return res.json(citas)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener citas' })
  }
}

export const create = async (req, res) => {
  try {
    if (req.user.rol !== 'paciente') {
      return res.status(403).json({ error: 'Solo pacientes pueden agendar citas' })
    }
    const { medicoId, fecha, hora, tipo } = req.body
    if (!medicoId || !fecha || !hora || !tipo) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' })
    }
    const cita = await citasService.create({
      pacienteId: req.user.id,
      medicoId,
      fecha,
      hora,
      tipo
    })
    return res.status(201).json(cita)
  } catch (err) {
    return res.status(500).json({ error: 'Error al agendar cita' })
  }
}

export const cancel = async (req, res) => {
  try {
    const cita = await citasService.cancel(req.params.id)
    return res.json(cita)
  } catch (err) {
    return res.status(500).json({ error: 'Error al cancelar cita' })
  }
}

export const setRestDay = async (req, res) => {
  try {
    const { dia } = req.body
    if (!dia) return res.status(400).json({ error: 'Día requerido' })
    const result = await citasService.setRestDay(req.params.id, dia)
    return res.json(result)
  } catch (err) {
    return res.status(500).json({ error: 'Error al marcar descanso' })
  }
}
