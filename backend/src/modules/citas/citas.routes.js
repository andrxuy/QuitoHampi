import { Router } from 'express'
import * as citasController from './citas.controller.js'
import { verifyToken, requireRole } from '../../middleware/auth.js'

const router = Router()

router.get('/medico/:medicoId', verifyToken, citasController.getByMedico)
router.get('/paciente/:pacienteId', verifyToken, citasController.getByPaciente)
router.post('/', verifyToken, citasController.create)
router.put('/:id/cancelar', verifyToken, citasController.cancel)
router.post('/medicos/:id/descanso', verifyToken, requireRole('medico'), citasController.setRestDay)

export default router
