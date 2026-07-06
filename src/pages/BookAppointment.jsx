import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { db } from '../utils/db'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import 'leaflet/dist/leaflet.css'
import './BookAppointment.css'

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

const BookAppointment = () => {
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
      navigate('/')
      return
    }
    setDoctor(doc)
    setAvgStars(parseFloat(db.getDoctorAverageStars(doc.email)))
    setTotalReviews(db.getDoctorReviews(doc.email).length)

    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    if (!user) {
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

    if (res.success) {
      setConfirmed(true)
    }
  }

  const goToHistory = () => {
    navigate('/mis-citas')
  }

  if (!doctor || !currentUser) return <div className="loading-screen">Cargando...</div>

  if (confirmed) {
    return (
      <>
        <Header />
        <main className="booking-main">
          <div className="container">
            <div className="confirmation-box">
              <div className="confirmation-icon">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h2>¡Cita agendada exitosamente!</h2>
              <div className="confirmation-details">
                <p><strong>Doctor:</strong> Dr. {doctor.nombre} {doctor.apellido}</p>
                <p><strong>Especialidad:</strong> {doctor.especialidad}</p>
                <p><strong>Fecha:</strong> {selectedDate.date}</p>
                <p><strong>Hora:</strong> {selectedTime}</p>
                <p><strong>Tipo:</strong> {appointmentType === 'presencial' ? 'Presencial' : 'Virtual'}</p>
              </div>
              <button onClick={goToHistory} className="goto-history-btn">
                Ir a mis citas
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="booking-main">
        <div className="container">
          <div className="booking-back">
            <Link to={`/doctor/${encodeURIComponent(doctor.email)}`}>
              <i className="fa-solid fa-arrow-left"></i> Volver al perfil
            </Link>
          </div>

          <div className="booking-doctor-header">
            <div className="booking-doctor-photo">
              <img src={doctor.foto || 'https://via.placeholder.com/150'} alt={`${doctor.nombre} ${doctor.apellido}`} />
            </div>
            <div className="booking-doctor-data">
              <h2>Dr. {doctor.nombre} {doctor.apellido}</h2>
              <p className="booking-doctor-specialty">{doctor.especialidad}</p>
              <div className="booking-doctor-stars">
                {renderStars(Math.round(avgStars))}
                <span className="stars-avg">{avgStars}</span>
                <span className="stars-count">({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})</span>
              </div>
            </div>
          </div>

          {doctor.lat && doctor.lng && (
            <div className="booking-map-section">
              <div className="booking-map-container">
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
                  <Marker position={[doctor.lat, doctor.lng]} icon={blueIcon}>
                    <Popup>
                      {doctor.nombre} {doctor.apellido}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              {doctor.direccion && (
                <p className="booking-address">
                  <i className="fa-solid fa-location-dot"></i> {doctor.direccion}
                </p>
              )}
            </div>
          )}

          <div className="appointment-type-selector">
            <label>Tipo de cita:</label>
            <div className="type-options">
              <button
                className={`type-btn ${appointmentType === 'presencial' ? 'active' : ''}`}
                onClick={() => setAppointmentType('presencial')}
              >
                <i className="fa-solid fa-building"></i> Presencial
              </button>
              <button
                className={`type-btn ${appointmentType === 'virtual' ? 'active' : ''}`}
                onClick={() => setAppointmentType('virtual')}
              >
                <i className="fa-solid fa-video"></i> Virtual
              </button>
            </div>
          </div>

          {step === 'calendar' && (
            <div className="calendar-section">
              <h3>Selecciona un día disponible</h3>
              <div className="calendar-grid">
                {calendarDays.map((day, idx) => (
                  <button
                    key={idx}
                    className={`calendar-day ${day.isAvailable ? 'available' : 'unavailable'} ${selectedDate?.date === day.date ? 'selected' : ''}`}
                    onClick={() => day.isAvailable && handleDateSelect(day)}
                    disabled={!day.isAvailable}
                  >
                    <span className="day-number">{day.dayNumber}</span>
                    <span className="day-month">{day.month}</span>
                    <span className="day-name">{day.dayName.substring(0, 3)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'time' && selectedDate && (
            <div className="time-section">
              <h3>Selecciona una hora disponible para el {selectedDate.date}</h3>
              <div className="time-slots-grid">
                {selectedDate.availableSlots.map((time) => (
                  <button
                    key={time}
                    className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(time)}
                  >
                    {time}
                  </button>
                ))}
              </div>
              <button className="back-step-btn" onClick={() => setStep('calendar')}>
                <i className="fa-solid fa-arrow-left"></i> Elegir otro día
              </button>
            </div>
          )}

          {step === 'confirm' && selectedDate && selectedTime && (
            <div className="confirm-section">
              <h3>Confirma tu cita</h3>

              <div className="summary-card">
                <h4>Resumen de la cita</h4>
                <div className="summary-row">
                  <span>Doctor:</span>
                  <span>Dr. {doctor.nombre} {doctor.apellido}</span>
                </div>
                <div className="summary-row">
                  <span>Especialidad:</span>
                  <span>{doctor.especialidad}</span>
                </div>
                <div className="summary-row">
                  <span>Fecha:</span>
                  <span>{selectedDate.date}</span>
                </div>
                <div className="summary-row">
                  <span>Hora:</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="summary-row">
                  <span>Tipo:</span>
                  <span>{appointmentType === 'presencial' ? 'Presencial' : 'Virtual'}</span>
                </div>
              </div>

              <div className="confirm-actions">
                <button className="back-step-btn" onClick={() => setStep('time')}>
                  <i className="fa-solid fa-arrow-left"></i> Cambiar hora
                </button>
                <button className="confirm-btn" onClick={handleConfirm}>
                  Confirmar cita
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default BookAppointment
