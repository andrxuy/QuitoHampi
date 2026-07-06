import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { MapContainer, TileLayer, Marker } from 'react-leaflet'
import L from 'leaflet'
import { db } from '../utils/db'
import 'leaflet/dist/leaflet.css'
import './PatientAppointment.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const blueIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const DAYS_OF_WEEK = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00']

const PatientAppointment = () => {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [appointmentType, setAppointmentType] = useState('presencial')
  const [step, setStep] = useState('calendar')
  const [confirmed, setConfirmed] = useState(false)
  const [calendarDays, setCalendarDays] = useState([])
  const [avgStars, setAvgStars] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    const doc = db.getDoctorByEmail(decodeURIComponent(doctorId))
    if (!doc) {
      navigate('/panel-paciente/buscar')
      return
    }
    setDoctor(doc)
    setAvgStars(parseFloat(db.getDoctorAverageStars(doc.email)))
    setTotalReviews(db.getDoctorReviews(doc.email).length)

    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    if (!user || user.role !== 'paciente') {
      navigate('/login')
      return
    }
    setCurrentUser(user)

    const restDays = db.getDoctorRestDays(doc.email)
    const appointments = db.getAppointments().filter(a => a.doctorEmail.toLowerCase() === doc.email.toLowerCase())

    const days = []
    const today = new Date()
    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dayName = DAYS_OF_WEEK[date.getDay()]
      const dateStr = date.toISOString().split('T')[0]

      const isRest = restDays.includes(dayName)
      const occupiedSlots = appointments
        .filter(a => a.date === dateStr && a.status !== 'cancelada')
        .map(a => a.time)

      const availableSlots = isRest ? [] : TIME_SLOTS.filter(t => !occupiedSlots.includes(t))

      days.push({
        date: dateStr,
        dayName,
        dayNumber: date.getDate(),
        month: date.toLocaleString('es-ES', { month: 'short' }),
        isAvailable: availableSlots.length > 0,
        availableSlots
      })
    }
    setCalendarDays(days)
  }, [doctorId, navigate])

  const renderStars = (stars) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fa-solid fa-star ${i < stars ? 'star-filled' : 'star-empty'}`}></i>
    ))
  }

  const handleDateSelect = (day) => {
    setSelectedDate(day)
    setSelectedTime(null)
    setStep('time')
  }

  const handleTimeSelect = (time) => {
    setSelectedTime(time)
    setStep('confirm')
  }

  const handleConfirm = () => {
    const res = db.bookAppointment({
      doctorEmail: doctor.email,
      patientName: `${currentUser.nombre} ${currentUser.apellido}`,
      patientEmail: currentUser.email,
      date: selectedDate.date,
      time: selectedTime,
      specialty: doctor.especialidad,
      type: appointmentType,
      status: 'confirmada',
      day: selectedDate.dayName
    })
    if (res.success) setConfirmed(true)
  }

  if (!doctor || !currentUser) return <div className="panel-loading">Cargando...</div>

  if (confirmed) {
    return (
      <div className="patient-appointment-page">
        <div className="appointment-confirmed">
          <div className="confirmed-icon"><i className="fa-solid fa-circle-check"></i></div>
          <h2>¡Cita agendada exitosamente!</h2>
          <div className="confirmed-details">
            <p><strong>Doctor:</strong> Dr. {doctor.nombre} {doctor.apellido}</p>
            <p><strong>Especialidad:</strong> {doctor.especialidad}</p>
            <p><strong>Fecha:</strong> {selectedDate.date}</p>
            <p><strong>Hora:</strong> {selectedTime}</p>
            <p><strong>Tipo:</strong> {appointmentType === 'presencial' ? 'Presencial' : 'Virtual'}</p>
          </div>
          <button onClick={() => navigate('/panel-paciente/citas')} className="confirmed-btn">Ir a mis citas</button>
        </div>
      </div>
    )
  }

  return (
    <div className="patient-appointment-page">
      <div className="appt-header">
        <div className="appt-header-photo">
          <img src={doctor.foto || 'https://via.placeholder.com/150'} alt={doctor.nombre} />
        </div>
        <div className="appt-header-data">
          <h2>Dr. {doctor.nombre} {doctor.apellido}</h2>
          <p className="appt-header-spec">{doctor.especialidad}</p>
          <div className="appt-header-stars">
            {renderStars(Math.round(avgStars))}
            <span className="appt-stars-avg">{avgStars}</span>
            <span className="appt-stars-count">({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})</span>
          </div>
        </div>
      </div>

      {doctor.lat && doctor.lng && (
        <div className="appt-map-section">
          <div className="appt-map-container">
            <MapContainer
              center={[doctor.lat, doctor.lng]}
              zoom={15}
              style={{ height: '300px', width: '100%', borderRadius: '12px' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[doctor.lat, doctor.lng]} icon={blueIcon} />
            </MapContainer>
          </div>
          {doctor.direccion && (
            <p className="appt-address"><i className="fa-solid fa-location-dot"></i> {doctor.direccion}</p>
          )}
        </div>
      )}

      <div className="appt-type-selector">
        <label>Tipo de cita:</label>
        <div className="appt-type-options">
          <button className={`appt-type-btn ${appointmentType === 'presencial' ? 'active' : ''}`} onClick={() => setAppointmentType('presencial')}>
            <i className="fa-solid fa-building"></i> Presencial
          </button>
          <button className={`appt-type-btn ${appointmentType === 'virtual' ? 'active' : ''}`} onClick={() => setAppointmentType('virtual')}>
            <i className="fa-solid fa-video"></i> Virtual
          </button>
        </div>
      </div>

      {step === 'calendar' && (
        <div className="appt-calendar-section">
          <h3>Selecciona un día disponible</h3>
          <div className="appt-calendar-grid">
            {calendarDays.map((day, idx) => (
              <button key={idx} className={`appt-calendar-day ${day.isAvailable ? 'available' : 'unavailable'} ${selectedDate?.date === day.date ? 'selected' : ''}`}
                onClick={() => day.isAvailable && handleDateSelect(day)} disabled={!day.isAvailable}>
                <span className="appt-day-number">{day.dayNumber}</span>
                <span className="appt-day-month">{day.month}</span>
                <span className="appt-day-name">{day.dayName.substring(0, 3)}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 'time' && selectedDate && (
        <div className="appt-time-section">
          <h3>Selecciona una hora para el {selectedDate.date}</h3>
          <div className="appt-time-slots">
            {selectedDate.availableSlots.map((time) => (
              <button key={time} className={`appt-time-slot ${selectedTime === time ? 'selected' : ''}`} onClick={() => handleTimeSelect(time)}>
                {time}
              </button>
            ))}
          </div>
          <button className="appt-back-btn" onClick={() => setStep('calendar')}>
            <i className="fa-solid fa-arrow-left"></i> Elegir otro día
          </button>
        </div>
      )}

      {step === 'confirm' && selectedDate && selectedTime && (
        <div className="appt-confirm-section">
          <h3>Confirma tu cita</h3>
          <div className="appt-summary">
            <div className="appt-summary-row"><span>Doctor:</span><span>Dr. {doctor.nombre} {doctor.apellido}</span></div>
            <div className="appt-summary-row"><span>Especialidad:</span><span>{doctor.especialidad}</span></div>
            <div className="appt-summary-row"><span>Fecha:</span><span>{selectedDate.date}</span></div>
            <div className="appt-summary-row"><span>Hora:</span><span>{selectedTime}</span></div>
            <div className="appt-summary-row"><span>Tipo:</span><span>{appointmentType === 'presencial' ? 'Presencial' : 'Virtual'}</span></div>
          </div>
          <div className="appt-confirm-actions">
            <button className="appt-back-btn" onClick={() => setStep('time')}><i className="fa-solid fa-arrow-left"></i> Cambiar hora</button>
            <button className="appt-confirm-btn" onClick={handleConfirm}>Confirmar cita</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PatientAppointment
