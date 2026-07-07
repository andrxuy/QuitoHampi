import { Router } from 'express'
import * as authController from './auth.controller.js'
import { verifyToken } from '../../middleware/auth.js'

const router = Router()

router.post('/login', authController.login)
router.post('/register', authController.register)
router.post('/forgot-password', authController.forgotPassword)
router.put('/change-password', verifyToken, authController.changePassword)

export default router
