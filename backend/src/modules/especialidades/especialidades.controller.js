import * as especialidadesService from './especialidades.service.js'

export const getAll = async (req, res) => {
  try {
    const especialidades = await especialidadesService.getAll()
    return res.json(especialidades)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener especialidades' })
  }
}

export const create = async (req, res) => {
  try {
    const { nombre } = req.body
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' })
    const especialidad = await especialidadesService.create(nombre)
    return res.status(201).json(especialidad)
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear especialidad' })
  }
}

export const update = async (req, res) => {
  try {
    const { nombre } = req.body
    if (!nombre) return res.status(400).json({ error: 'Nombre requerido' })
    const especialidad = await especialidadesService.update(req.params.id, nombre)
    return res.json(especialidad)
  } catch (err) {
    return res.status(500).json({ error: 'Error al actualizar especialidad' })
  }
}

export const toggleActive = async (req, res) => {
  try {
    const especialidad = await especialidadesService.toggleActive(req.params.id)
    return res.json(especialidad)
  } catch (err) {
    return res.status(500).json({ error: 'Error al cambiar estado' })
  }
}
