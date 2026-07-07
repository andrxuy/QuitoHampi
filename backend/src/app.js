import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

import authRoutes from './modules/auth/auth.routes.js'
import medicosRoutes from './modules/medicos/medicos.routes.js'
import pacientesRoutes from './modules/pacientes/pacientes.routes.js'
import citasRoutes from './modules/citas/citas.routes.js'
import especialidadesRoutes from './modules/especialidades/especialidades.routes.js'
import resenasRoutes from './modules/resenas/resenas.routes.js'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/medicos', medicosRoutes)
app.use('/api/pacientes', pacientesRoutes)
app.use('/api/citas', citasRoutes)
app.use('/api/especialidades', especialidadesRoutes)
app.use('/api', resenasRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default app
