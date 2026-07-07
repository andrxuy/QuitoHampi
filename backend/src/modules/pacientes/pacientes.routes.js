import { Router } from 'express'
import * as pacientesController from './pacientes.controller.js'
import { verifyToken, requireRole } from '../../middleware/auth.js'

const router = Router()

router.get('/', verifyToken, requireRole('admin'), pacientesController.getAll)
router.get('/:id', verifyToken, pacientesController.getById)
router.put('/:id', verifyToken, pacientesController.update)
router.put('/:id/bloquear', verifyToken, requireRole('admin'), pacientesController.toggleBlock)

export default router
