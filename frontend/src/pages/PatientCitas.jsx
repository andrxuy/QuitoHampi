import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { db } from '../utils/db'
import './PatientCitas.css'

const PatientCitas = () => {
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [activeTab, setActiveTab] = useState('proximas')
  const [showCancelModal, setShowCancelModal] = useState(null)

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    if (!user || user.role !== 'paciente') {
      navigate('/login')
      return
    }
    setCurrentUser(user)
    const allAppts = db.getPatientAppointments(user.email)
    setAppointments(allAppts.sort((a, b) => new Date(a.date) - new Date(b.date)))
  }, [navigate])

  const handleCancel = (id) => {
    db.cancelAppointment(id)
    setShowCancelModal(null)
    if (currentUser) setAppointments(db.getPatientAppointments(currentUser.email))
  }

  const getDoctor = (email) => db.getDoctorByEmail(email)

  const isUpcoming = (a) => {
    const today = new Date(); today.setHours(0,0,0,0)
    return a.status === 'confirmada' && new Date(a.date) >= today
  }
  const isPast = (a) => a.status === 'realizada'
  const isCancelled = (a) => a.status === 'cancelada'

  const filtered = appointments.filter(a => {
    if (activeTab === 'proximas') return isUpcoming(a)
    if (activeTab === 'realizadas') return isPast(a)
    if (activeTab === 'canceladas') return isCancelled(a)
    return true
  })

  if (!currentUser) return <div className="panel-loading">Cargando...</div>

  return (
    <div className="patient-citas-page">
      <div className="citas-header">
        <h1>Mis Citas</h1>
      </div>

      <div className="citas-tabs">
        <button className={`citas-tab ${activeTab === 'proximas' ? 'active' : ''}`} onClick={() => setActiveTab('proximas')}>Próximas</button>
        <button className={`citas-tab ${activeTab === 'realizadas' ? 'active' : ''}`} onClick={() => setActiveTab('realizadas')}>Realizadas</button>
        <button className={`citas-tab ${activeTab === 'canceladas' ? 'active' : ''}`} onClick={() => setActiveTab('canceladas')}>Canceladas</button>
      </div>

      <div className="citas-list">
        {filtered.length === 0 ? (
          <div className="citas-empty">
            <i className="fa-solid fa-calendar"></i>
            <p>No tienes citas {activeTab === 'proximas' ? 'próximas' : activeTab === 'realizadas' ? 'realizadas' : 'canceladas'}.</p>
          </div>
        ) : (
          filtered.map(a => {
            const doc = getDoctor(a.doctorEmail)
            return (
              <div key={a.id} className="citas-card">
                <div className="citas-card-photo">
                  <img src={doc?.foto || 'https://via.placeholder.com/60'} alt={doc?.nombre || 'Doctor'} />
                </div>
                <div className="citas-card-info">
                  <h3>Dr. {doc?.nombre || 'Médico'} {doc?.apellido || ''}</h3>
                  <p className="citas-card-spec">{a.specialty}</p>
                  <p className="citas-card-date"><i className="fa-solid fa-calendar-day"></i> {a.date} - {a.time}</p>
                  <p className="citas-card-type"><i className="fa-solid fa-circle-info"></i> {a.type === 'presencial' ? 'Presencial' : 'Virtual'}</p>
                </div>
                <div className="citas-card-status">
                  <span className={`citas-badge ${a.status}`}>
                    {a.status === 'confirmada' ? 'Próxima' : a.status === 'realizada' ? 'Realizada' : 'Cancelada'}
                  </span>
                  {isUpcoming(a) && (
                    <button className="citas-cancel-btn" onClick={() => setShowCancelModal(a.id)}>Cancelar cita</button>
                  )}
                  {isPast(a) && (
                    <Link to={`/doctor/${encodeURIComponent(a.doctorEmail)}`} className="citas-review-btn">Dejar reseña</Link>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {showCancelModal && (
        <div className="citas-modal-overlay" onClick={() => setShowCancelModal(null)}>
          <div className="citas-modal" onClick={e => e.stopPropagation()}>
            <h3>¿Cancelar cita?</h3>
            <p>Esta acción no se puede deshacer.</p>
            <div className="citas-modal-actions">
              <button className="citas-modal-no" onClick={() => setShowCancelModal(null)}>No, mantener cita</button>
              <button className="citas-modal-yes" onClick={() => handleCancel(showCancelModal)}>Sí, cancelar cita</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientCitas
