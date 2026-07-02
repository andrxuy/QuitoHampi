import './Recuperar.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import TypeIt from 'typeit-react'
import { db } from '../utils/db'

const Recuperar = () => {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState(1) // 1: Email, 2: New Password
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate()

  const handleSendLink = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Por favor ingresa tu correo electrónico')
      return
    }

    const user = db.getUserByEmail(email)
    if (!user) {
      setError('El correo electrónico no está registrado')
      return
    }

    setSuccess('Se ha enviado un enlace de recuperación. En este entorno demo, puedes restablecer tu contraseña directamente aquí.')
    setTimeout(() => {
      setStep(2)
    }, 2000)
  }

  const handleResetPassword = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!newPassword || !confirmPassword) {
      setError('Por favor completa todos los campos')
      return
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    // Update password in DB
    const res = db.updateUser(email, { password: newPassword })
    if (res.success) {
      setSuccess('¡Contraseña restablecida con éxito! Redirigiendo al inicio de sesión...')
      setTimeout(() => {
        navigate('/login')
      }, 2500)
    } else {
      setError(res.message || 'Error al restablecer la contraseña')
    }
  }

  return (
    <div className="recuperar-container">
      <div className="recuperar-card">
        <div className="recuperar-header">
          <h2 className="recuperar-title">
            <TypeIt options={{ speed: 100, waitUntilVisible: true, cursor: false }}>
              Quito<span className="recuperar-title-highlight">Hampi</span>
            </TypeIt>
          </h2>
          <p className="recuperar-subtitle">Restablecer Contraseña</p>
        </div>

        {error && <div className="recuperar-error">{error}</div>}
        {success && <div className="recuperar-success">{success}</div>}

        {step === 1 ? (
          <form onSubmit={handleSendLink} className="recuperar-form">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="recuperar-button">
              Enviar Enlace
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="recuperar-form">
            <div className="form-group">
              <label htmlFor="newPassword">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repite tu contraseña"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="recuperar-button">
              Restablecer Contraseña
            </button>
          </form>
        )}

        <div className="recuperar-footer">
          <p>¿Recordaste tu contraseña? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Recuperar
