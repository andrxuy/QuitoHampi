import './Login.css'
import { Link, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import TypeIt from 'typeit-react'
import { db } from '../utils/db'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [lockoutTime, setLockoutTime] = useState(0) // remaining seconds
  const navigate = useNavigate()

  // Initialize DB
  useEffect(() => {
    db.init()
  }, [])

  // Check lockout on mount and when it changes
  useEffect(() => {
    if (!email) return
    const checkLockout = () => {
      const attempts = db.getLoginAttempts(email)
      if (attempts.blockUntil) {
        const remaining = Math.max(0, Math.ceil((attempts.blockUntil - new Date().getTime()) / 1000))
        setLockoutTime(remaining)
      } else {
        setLockoutTime(0)
      }
    }

    checkLockout()
    const timer = setInterval(checkLockout, 1000)
    return () => clearInterval(timer)
  }, [email])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    // Check if currently locked out
    const attempts = db.getLoginAttempts(email)
    if (attempts.blockUntil && new Date().getTime() < attempts.blockUntil) {
      const remaining = Math.ceil((attempts.blockUntil - new Date().getTime()) / 1000)
      setError(`Acceso bloqueado. Intenta de nuevo en ${remaining} segundos.`)
      return
    }

    const user = db.getUserByEmail(email)

    if (!user || user.password !== password) {
      // Record failed attempt
      const updatedAttempts = db.recordFailedAttempt(email)
      if (updatedAttempts.count >= 3) {
        setError('Has superado el límite de intentos. Acceso bloqueado por 5 minutos.')
      } else {
        setError(`Credenciales incorrectas. Intentos restantes: ${3 - updatedAttempts.count}`)
      }
      return
    }

    if (user.estado === 'Bloqueado') {
      setError('Tu cuenta ha sido bloqueada por el administrador.')
      return
    }

    if (user.estado === 'Pendiente') {
      setError('Tu registro de médico está pendiente de verificación por el administrador.')
      return
    }

    if (user.estado === 'Rechazado') {
      setError('Tu registro de médico ha sido rechazado.')
      return
    }

    // Successful login
    db.resetFailedAttempts(email)
    localStorage.setItem('quitohampi_current_user', JSON.stringify(user))
    
    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/dashboard')
    } else if (user.role === 'medico') {
      navigate('/dashboard')
    } else {
      navigate('/panel-paciente/buscar')
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <Link to="/" className="back-home-btn">
          <i className="fa-solid fa-arrow-left"></i> Volver al inicio
        </Link>
        <div className="login-header">
          <h2 className="login-title">
            <TypeIt
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false,
                startDelay: 300
              }}
            >
              Quito<span className="login-title-highlight">Hampi</span>
            </TypeIt>
          </h2>
          <p className="login-subtitle">
            Bienvenido de vuelta
          </p>
        </div>
        
        {error && <div className="login-error">{error}</div>}
        {lockoutTime > 0 && (
          <div className="login-error">
            Bloqueo de seguridad activo. Espera {lockoutTime} segundos.
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={lockoutTime > 0}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={lockoutTime > 0}
              required
            />
          </div>
          
          <div className="login-options">
            <label className="remember-me">
              <input type="checkbox" /> Recordarme
            </label>
            <Link to="/recuperar" className="forgot-password">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          
          <button type="submit" className="login-button" disabled={lockoutTime > 0}>
            Ingresar
          </button>
        </form>

        
        <div className="login-footer">
          <p>¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Login