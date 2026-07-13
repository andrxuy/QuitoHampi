import './Register.css'
import { Link, useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import TypeIt from 'typeit-react'
import { db } from '../utils/db'

const Register = () => {
  const [role, setRole] = useState('paciente') // 'paciente' or 'medico'
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    cedula: '',
    email: '',
    password: '',
    confirmPassword: '',
    telefono: '',
    edad: '',
    especialidad: '',
    otraEspecialidad: '',
    titulos: '',
    certificaciones: ''
  })
  
  const [files, setFiles] = useState([]) // Array of { name, size, type, fileObject }
  const [specialties, setSpecialties] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    db.init()
    setSpecialties(db.getSpecialties().filter(s => s.status === 'Activo'))
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    })
  }

  const handleFileChange = (e) => {
    setError('')
    const selectedFiles = Array.from(e.target.files)
    const validFiles = []

    for (let file of selectedFiles) {
      // 3MB limit = 3 * 1024 * 1024 bytes
      if (file.size > 3 * 1024 * 1024) {
        setError(`El archivo "${file.name}" supera el límite de 3MB.`);
        return
      }
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        setError(`El archivo "${file.name}" no tiene un formato válido (PDF, JPG, PNG).`);
        return
      }

      const sizeStr = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`

      validFiles.push({
        name: file.name,
        size: sizeStr,
        type: file.type
      })
    }

    setFiles([...files, ...validFiles])
  }

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { 
      nombre, apellido, cedula, email, password, confirmPassword, 
      telefono, edad, especialidad, otraEspecialidad, titulos, certificaciones 
    } = formData

    // Basic validation
    if (!nombre || !apellido || !cedula || !email || !password || !confirmPassword || !telefono) {
      setError('Campos obligatorios incompletos')
      return
    }

    if (!/^\d{10}$/.test(cedula)) {
      setError('La cédula debe tener exactamente 10 dígitos numéricos')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (role === 'medico') {
      if (!edad || !especialidad || !titulos) {
        setError('Campos obligatorios incompletos (edad, especialidad y títulos son requeridos)')
        return
      }
      if (especialidad === 'Otros' && !otraEspecialidad) {
        setError('Por favor especifica tu especialidad en el campo "Otra especialidad"')
        return
      }
      if (files.length === 0) {
        setError('Debes subir al menos un documento (título o licencia)')
        return
      }
    }

    const finalSpecialty = especialidad === 'Otros' ? otraEspecialidad : especialidad;

    const payload = {
      nombre,
      apellido,
      email,
      password,
      rol: role,
      cedula,
      telefono
    }

    if (role === 'medico') {
      payload.especialidad = finalSpecialty
      payload.edad = parseInt(edad)
    }

    setError('')
    setSuccess('')

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Error al registrar')
        return
      }

      setSuccess(data.message || 'Registro exitoso')
      setFormData({
        nombre: '', apellido: '', cedula: '', email: '', password: '', confirmPassword: '',
        telefono: '', edad: '', especialidad: '', otraEspecialidad: '', titulos: '', certificaciones: ''
      })
      setFiles([])

      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError('Error de conexión con el servidor')
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <Link to="/" className="back-home-btn">
          <i className="fa-solid fa-arrow-left"></i> Volver al inicio
        </Link>
        <div className="register-header">
          <h2 className="register-title">
            <TypeIt
              options={{
                speed: 100,
                waitUntilVisible: true,
                cursor: false,
                startDelay: 300
              }}
            >
              Quito<span className="register-title-highlight">Hampi</span>
            </TypeIt>
          </h2>
          <p className="register-subtitle">
            Crea tu cuenta en la plataforma
          </p>
        </div>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        {/* Role Toggle Buttons */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${role === 'paciente' ? 'active' : ''}`}
            onClick={() => { setRole('paciente'); setError(''); setSuccess(''); }}
          >
            Registrarse como Paciente
          </button>
          <button
            type="button"
            className={`role-btn ${role === 'medico' ? 'active' : ''}`}
            onClick={() => { setRole('medico'); setError(''); setSuccess(''); }}
          >
            Registrarse como Médico
          </button>
        </div>

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Ej: Juan"
                value={formData.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="apellido">Apellido</label>
              <input
                type="text"
                id="apellido"
                placeholder="Ej: Pérez"
                value={formData.apellido}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="cedula">Cédula de identidad</label>
            <input
              type="text"
              id="cedula"
              placeholder="Ej: 1712345678"
              maxLength="10"
              value={formData.cedula}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, '').slice(0, 10)
                setFormData({ ...formData, cedula: val })
              }}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input
                type="email"
                id="email"
                placeholder="ejemplo@correo.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="telefono">Teléfono de Contacto</label>
              <input
                type="tel"
                id="telefono"
                placeholder="Ej: 0984969316"
                value={formData.telefono}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {role === 'medico' && (
            <>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="edad">Edad</label>
                  <input
                    type="number"
                    id="edad"
                    placeholder="Ej: 35"
                    value={formData.edad}
                    onChange={handleChange}
                    min="22"
                    max="80"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="especialidad">Especialidad</label>
                  <select
                    id="especialidad"
                    value={formData.especialidad}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Seleccione una especialidad</option>
                    {specialties.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                    <option value="Otros">Otros (especificar)</option>
                  </select>
                </div>
              </div>

              {formData.especialidad === 'Otros' && (
                <div className="form-group">
                  <label htmlFor="otraEspecialidad">Escriba su Especialidad</label>
                  <input
                    type="text"
                    id="otraEspecialidad"
                    placeholder="Ej: Neurología"
                    value={formData.otraEspecialidad}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="titulos">Títulos Obtenidos</label>
                <input
                  type="text"
                  id="titulos"
                  placeholder="Ej: Médico Cirujano - Universidad Central"
                  value={formData.titulos}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="certificaciones">Certificaciones Adicionales</label>
                <input
                  type="text"
                  id="certificaciones"
                  placeholder="Ej: Especialista en Pediatría (opcional)"
                  value={formData.certificaciones}
                  onChange={handleChange}
                />
              </div>

              {/* Document Upload Zone */}
              <div className="form-group">
                <label>Documentación de Respaldo (Título, Licencia - Máx. 3MB)</label>
                <div className="upload-zone">
                  <input
                    type="file"
                    id="file-upload"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <label htmlFor="file-upload" className="upload-zone-label">
                    <i className="fa-solid fa-cloud-arrow-up upload-icon"></i>
                    <span>Arrastra o selecciona archivos (PDF, JPG, PNG)</span>
                  </label>
                </div>

                {files.length > 0 && (
                  <div className="uploaded-files-list">
                    {files.map((file, idx) => (
                      <div key={idx} className="uploaded-file-item">
                        <span className="file-name">
                          <i className="fa-solid fa-file-pdf"></i> {file.name} ({file.size})
                        </span>
                        <button
                          type="button"
                          className="file-remove-btn"
                          onClick={() => removeFile(idx)}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Repite tu contraseña"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="register-terms">
            <label className="terms-check">
              <input type="checkbox" required /> 
              Acepto los <Link to="/terminos">Términos y Condiciones</Link>
            </label>
          </div>

          <button type="submit" className="register-button">
            {role === 'medico' ? 'Enviar Solicitud de Registro' : 'Registrarse'}
          </button>
        </form>

        <div className="register-footer">
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link></p>
        </div>
      </div>
    </div>
  )
}

export default Register