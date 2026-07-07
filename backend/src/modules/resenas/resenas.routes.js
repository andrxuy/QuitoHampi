import { Router } from 'express'
import * as resenasController from './resenas.controller.js'
import { verifyToken, requireRole } from '../../middleware/auth.js'

const router = Router()

router.get('/medicos/:id/resenas', resenasController.getByMedico)
router.post('/medicos/:id/resenas', verifyToken, resenasController.create)
router.get('/admin/resenas', verifyToken, requireRole('admin'), resenasController.getAllAdmin)
router.put('/admin/resenas/:id/ocultar', verifyToken, requireRole('admin'), resenasController.toggleVisibility)
router.delete('/admin/resenas/:id', verifyToken, requireRole('admin'), resenasController.remove)

export default router
