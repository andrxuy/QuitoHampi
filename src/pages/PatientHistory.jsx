import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { db } from '../utils/db'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import './PatientHistory.css'

const PatientHistory = () => {
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
    
    const allAppointments = db.getPatientAppointments(user.email)
    const sorted = allAppointments.sort((a, b) => new Date(a.date) - new Date(b.date))
    setAppointments(sorted)
  }, [navigate])

  const handleCancel = (id) => {
    db.cancelAppointment(id)
    setShowCancelModal(null)
    if (currentUser) {
      setAppointments(db.getPatientAppointments(currentUser.email))
    }
  }

  const getDoctorByEmail = (email) => {
    return db.getDoctorByEmail(email)
  }

  const getStatusBadge = (status) => {
    if (status === 'confirmada') return 'Próxima'
    if (status === 'realizada') return 'Realizada'
    if (status === 'cancelada') return 'Cancelada'
    return status
  }

  const isUpcoming = (appt) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const apptDate = new Date(appt.date)
    return appt.status === 'confirmada' && apptDate >= today
  }

  const isPast = (appt) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const apptDate = new Date(appt.date)
    return appt.status === 'realizada' || (appt.status === 'confirmada' && apptDate < today)
  }

  const isCancelled = (appt) => appt.status === 'cancelada'

  const filteredAppointments = appointments.filter(appt => {
    if (activeTab === 'proximas') return isUpcoming(appt)
    if (activeTab === 'realizadas') return isPast(appt) && appt.status === 'realizada'
    if (activeTab === 'canceladas') return isCancelled(appt)
    return true
  })

  if (!currentUser) return <div className="loading-screen">Cargando...</div>

  return (
    <>
      <Header />
      <main className="history-main">
        <div className="container">
          <div className="history-header">
            <h1>Mis Citas</h1>
            <p>Historial completo de tus consultas médicas</p>
          </div>

          <div className="tabs-container">
            <button
              className={`tab-btn ${activeTab === 'proximas' ? 'active' : ''}`}
              onClick={() => setActiveTab('proximas')}
            >
              Próximas
            </button>
            <button
              className={`tab-btn ${activeTab === 'realizadas' ? 'active' : ''}`}
              onClick={() => setActiveTab('realizadas')}
            >
              Realizadas
            </button>
            <button
              className={`tab-btn ${activeTab === 'canceladas' ? 'active' : ''}`}
              onClick={() => setActiveTab('canceladas')}
            >
              Canceladas
            </button>
          </div>

          <div className="appointments-list">
            {filteredAppointments.length === 0 ? (
              <div className="no-appointments">
                <i className="fa-solid fa-calendar"></i>
                <p>No tienes citas {activeTab === 'proximas' ? 'próximas' : activeTab === 'realizadas' ? 'realizadas' : 'canceladas'}.</p>
              </div>
            ) : (
              filteredAppointments.map((appt) => {
                const doctor = getDoctorByEmail(appt.doctorEmail)
                return (
                  <div key={appt.id} className={`appointment-card ${appt.status}`}>
                    <div className="appt-photo">
                      <img src={doctor?.foto || 'https://via.placeholder.com/60'} alt={doctor?.nombre || 'Doctor'} />
                    </div>
                    <div className="appt-info">
                      <h3>Dr. {doctor?.nombre || 'Médico'} {doctor?.apellido || ''}</h3>
                      <p className="appt-specialty">{appt.specialty}</p>
                      <p className="appt-datetime">
                        <i className="fa-solid fa-calendar-day"></i> {appt.date} - {appt.time}
                      </p>
                      <p className="appt-type">
                        <i className="fa-solid fa-circle-info"></i> {appt.type === 'presencial' ? 'Presencial' : 'Virtual'}
                      </p>
                    </div>
                    <div className="appt-status-section">
                      <span className={`appt-status-badge ${appt.status}`}>
                        {getStatusBadge(appt.status)}
                      </span>
                      {isUpcoming(appt) && (
                        <button
                          className="cancel-appt-btn"
                          onClick={() => setShowCancelModal(appt.id)}
                        >
                          Cancelar cita
                        </button>
                      )}
                      {appt.status === 'realizada' && (
                        <Link
                          to={`/doctor/${encodeURIComponent(appt.doctorEmail)}`}
                          className="review-link-btn"
                        >
                          Dejar reseña
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </main>

      {showCancelModal && (
        <div className="cancel-modal-overlay" onClick={() => setShowCancelModal(null)}>
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h3>¿Cancelar cita?</h3>
            <p>Esta acción no se puede deshacer. ¿Estás seguro de que deseas cancelar esta cita?</p>
            <div className="cancel-modal-actions">
              <button className="modal-cancel-btn" onClick={() => setShowCancelModal(null)}>
                No, mantener cita
              </button>
              <button className="modal-confirm-btn" onClick={() => handleCancel(showCancelModal)}>
                Sí, cancelar cita
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}

export default PatientHistory
