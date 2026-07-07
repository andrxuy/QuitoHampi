import { Router } from 'express'
import * as medicosController from './medicos.controller.js'
import { verifyToken, requireRole } from '../../middleware/auth.js'

const router = Router()

router.get('/', medicosController.getAll)
router.get('/pendientes', verifyToken, requireRole('admin'), medicosController.getPendientes)
router.get('/:id', medicosController.getById)
router.put('/:id/verificar', verifyToken, requireRole('admin'), medicosController.verificar)
router.put('/:id', verifyToken, medicosController.update)

export default router
