import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import './PatientProfile.css'

const PatientProfile = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    if (!user || user.role !== 'paciente') {
      navigate('/login')
      return
    }
    setCurrentUser(user)
    setFormData({ ...user })
  }, [navigate])

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem('quitohampi_users')) || []
    const index = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase())
    if (index !== -1) {
      users[index].nombre = formData.nombre
      users[index].apellido = formData.apellido
      users[index].telefono = formData.telefono
      localStorage.setItem('quitohampi_users', JSON.stringify(users))
    }
    const updatedUser = { ...currentUser, ...formData }
    localStorage.setItem('quitohampi_current_user', JSON.stringify(updatedUser))
    setCurrentUser(updatedUser)
    setEditing(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!currentUser) return <div className="panel-loading">Cargando...</div>

  return (
    <div className="patient-profile-page">
      <div className="profile-card">
        <div className="profile-card-header">
          <div className="profile-avatar-large">
            {currentUser.nombre[0]}{currentUser.apellido[0]}
          </div>
          <h2>{currentUser.nombre} {currentUser.apellido}</h2>
          <p className="profile-email">{currentUser.email}</p>
        </div>

        {saved && <div className="profile-saved-alert"><i className="fa-solid fa-check-circle"></i> Perfil actualizado correctamente</div>}

        {editing ? (
          <div className="profile-form">
            <div className="profile-field">
              <label>Nombre</label>
              <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} />
            </div>
            <div className="profile-field">
              <label>Apellido</label>
              <input type="text" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} />
            </div>
            <div className="profile-field">
              <label>Teléfono</label>
              <input type="text" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} />
            </div>
            <div className="profile-field">
              <label>Correo electrónico</label>
              <input type="email" value={formData.email} disabled />
            </div>
            <div className="profile-form-actions">
              <button className="profile-cancel-btn" onClick={() => { setEditing(false); setFormData({...currentUser}) }}>Cancelar</button>
              <button className="profile-save-btn" onClick={handleSave}>Guardar cambios</button>
            </div>
          </div>
        ) : (
          <div className="profile-info-display">
            <div className="profile-info-row">
              <span className="profile-label">Teléfono</span>
              <span className="profile-value">{currentUser.telefono || 'No registrado'}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-label">Correo</span>
              <span className="profile-value">{currentUser.email}</span>
            </div>
            <div className="profile-info-row">
              <span className="profile-label">Fecha de registro</span>
              <span className="profile-value">{currentUser.fechaRegistro || 'No disponible'}</span>
            </div>
            <button className="profile-edit-btn" onClick={() => setEditing(true)}>
              <i className="fa-solid fa-pen"></i> Editar perfil
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PatientProfile
