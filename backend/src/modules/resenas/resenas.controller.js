import * as resenasService from './resenas.service.js'

export const getByMedico = async (req, res) => {
  try {
    const resenas = await resenasService.getByMedico(req.params.id)
    return res.json(resenas)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener reseñas' })
  }
}

export const create = async (req, res) => {
  try {
    if (req.user.rol !== 'paciente') {
      return res.status(403).json({ error: 'Solo pacientes pueden dejar reseñas' })
    }
    const { estrellas, comentario } = req.body
    if (!estrellas || !comentario) {
      return res.status(400).json({ error: 'Estrellas y comentario requeridos' })
    }
    const resena = await resenasService.create({
      pacienteId: req.user.id,
      medicoId: parseInt(req.params.id),
      estrellas,
      comentario
    })
    return res.status(201).json(resena)
  } catch (err) {
    return res.status(500).json({ error: 'Error al crear reseña' })
  }
}

export const getAllAdmin = async (req, res) => {
  try {
    const resenas = await resenasService.getAllAdmin()
    return res.json(resenas)
  } catch (err) {
    return res.status(500).json({ error: 'Error al obtener reseñas' })
  }
}

export const toggleVisibility = async (req, res) => {
  try {
    const resena = await resenasService.toggleVisibility(req.params.id)
    return res.json(resena)
  } catch (err) {
    return res.status(500).json({ error: 'Error al cambiar visibilidad' })
  }
}

export const remove = async (req, res) => {
  try {
    await resenasService.remove(req.params.id)
    return res.json({ message: 'Reseña eliminada correctamente' })
  } catch (err) {
    return res.status(500).json({ error: 'Error al eliminar reseña' })
  }
}
