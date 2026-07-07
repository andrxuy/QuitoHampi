import { Router } from 'express'
import * as especialidadesController from './especialidades.controller.js'
import { verifyToken, requireRole } from '../../middleware/auth.js'

const router = Router()

router.get('/', especialidadesController.getAll)
router.post('/', verifyToken, requireRole('admin'), especialidadesController.create)
router.put('/:id', verifyToken, requireRole('admin'), especialidadesController.update)
router.put('/:id/desactivar', verifyToken, requireRole('admin'), especialidadesController.toggleActive)

export default router
