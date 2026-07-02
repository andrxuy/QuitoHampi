import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { db } from '../utils/db'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import 'leaflet/dist/leaflet.css'
import './DoctorProfile.css'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const DoctorProfile = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [doctor, setDoctor] = useState(null)
  const [reviews, setReviews] = useState([])
  const [avgStars, setAvgStars] = useState(0)
  const [currentUser, setCurrentUser] = useState(null)
  const [newReview, setNewReview] = useState({ stars: 0, comment: '' })
  const [hoverStars, setHoverStars] = useState(0)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')

  useEffect(() => {
    const doc = db.getDoctorByEmail(decodeURIComponent(id))
    if (!doc) {
      navigate('/')
      return
    }
    setDoctor(doc)
    setReviews(db.getDoctorReviews(doc.email))
    setAvgStars(parseFloat(db.getDoctorAverageStars(doc.email)))
    
    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    setCurrentUser(user)
  }, [id, navigate])

  const renderStars = (stars) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fa-solid fa-star ${i < stars ? 'star-filled' : 'star-empty'}`}></i>
    ))
  }

  const renderInteractiveStars = (rating, setter) => {
    return [...Array(5)].map((_, i) => (
      <i
        key={i}
        className={`fa-solid fa-star ${i < (hoverStars || rating) ? 'star-filled' : 'star-empty'}`}
        onMouseEnter={() => setHoverStars(i + 1)}
        onMouseLeave={() => setHoverStars(0)}
        onClick={() => setter(i + 1)}
        style={{ cursor: 'pointer', fontSize: '1.8rem' }}
      ></i>
    ))
  }

  const handleSubmitReview = (e) => {
    e.preventDefault()
    setReviewError('')

    if (!currentUser) {
      setReviewError('Debes iniciar sesión para dejar una reseña.')
      return
    }

    if (currentUser.role !== 'paciente') {
      setReviewError('Solo los pacientes pueden dejar reseñas.')
      return
    }

    if (newReview.stars === 0) {
      setReviewError('Selecciona una calificación de 1 a 5 estrellas.')
      return
    }

    if (!newReview.comment.trim()) {
      setReviewError('Escribe un comentario para tu reseña.')
      return
    }

    const patientAppointments = db.getPatientAppointments(currentUser.email)
    const hasAttended = patientAppointments.some(
      a => a.doctorEmail.toLowerCase() === doctor.email.toLowerCase() && a.status === 'realizada'
    )

    if (!hasAttended) {
      setReviewError('Solo puedes dejar reseña si has tenido una cita realizada con este doctor.')
      return
    }

    const existingReviews = db.getReviews()
    const alreadyReviewed = existingReviews.some(
      r => r.patientEmail.toLowerCase() === currentUser.email.toLowerCase() &&
           r.doctorEmail.toLowerCase() === doctor.email.toLowerCase()
    )
    if (alreadyReviewed) {
      setReviewError('Ya has dejado una reseña para este doctor.')
      return
    }

    db.addReview({
      patientName: `${currentUser.nombre} ${currentUser.apellido}`,
      patientEmail: currentUser.email,
      doctorName: `Dr. ${doctor.nombre} ${doctor.apellido}`,
      doctorEmail: doctor.email,
      stars: newReview.stars,
      comment: newReview.comment.trim()
    })

    setReviewSubmitted(true)
    setReviews(db.getDoctorReviews(doctor.email))
    setAvgStars(parseFloat(db.getDoctorAverageStars(doctor.email)))
    setNewReview({ stars: 0, comment: '' })
  }

  if (!doctor) return <div className="loading-screen">Cargando...</div>

  return (
    <>
      <Header />
      <main className="doctor-profile-main">
        <div className="container">
          <div className="profile-back">
            <Link to="/#busqueda"><i className="fa-solid fa-arrow-left"></i> Volver a resultados</Link>
          </div>

          <div className="profile-header-card">
            <div className="profile-photo">
              <img src={doctor.foto || 'https://via.placeholder.com/200'} alt={`${doctor.nombre} ${doctor.apellido}`} />
            </div>
            <div className="profile-info">
              <h1>Dr. {doctor.nombre} {doctor.apellido}</h1>
              <p className="profile-specialty">{doctor.especialidad}</p>
              <div className="profile-stars">
                {renderStars(Math.round(avgStars))}
                <span className="avg-rating">{avgStars}</span>
                <span className="total-reviews">({reviews.length} reseña{reviews.length !== 1 ? 's' : ''})</span>
              </div>
              {doctor.direccion && (
                <p className="profile-address">
                  <i className="fa-solid fa-location-dot"></i> {doctor.direccion}
                </p>
              )}
              <Link to={`/agendar/${encodeURIComponent(doctor.email)}`} className="profile-appointment-btn">
                Agendar cita
              </Link>
            </div>
          </div>

          {doctor.lat && doctor.lng && (
            <div className="profile-map-section">
              <h2>Ubicación del consultorio</h2>
              <div className="profile-map-container">
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
                  <Marker position={[doctor.lat, doctor.lng]}>
                    <Popup>
                      {doctor.nombre} {doctor.apellido}
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          )}

          <div className="profile-reviews-section">
            <h2>Reseñas y calificaciones</h2>

            {currentUser && currentUser.role === 'paciente' && !reviewSubmitted && (
              <div className="review-form-card">
                <h3>Deja tu reseña</h3>
                <form onSubmit={handleSubmitReview}>
                  <div className="review-stars-input">
                    <label>Calificación:</label>
                    <div className="interactive-stars">
                      {renderInteractiveStars(newReview.stars, (val) => setNewReview({...newReview, stars: val}))}
                    </div>
                  </div>
                  <div className="review-comment-input">
                    <label>Comentario:</label>
                    <textarea
                      placeholder="Comparte tu experiencia con este doctor..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      rows={4}
                    ></textarea>
                  </div>
                  {reviewError && <p className="review-error">{reviewError}</p>}
                  <button type="submit" className="submit-review-btn">Enviar reseña</button>
                </form>
              </div>
            )}

            {reviewSubmitted && (
              <div className="review-success">
                <i className="fa-solid fa-check-circle"></i>
                <p>¡Reseña enviada correctamente!</p>
              </div>
            )}

            {!currentUser && (
              <div className="review-login-prompt">
                <p><Link to="/login">Inicia sesión</Link> para dejar una reseña.</p>
              </div>
            )}

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">Este doctor aún no tiene reseñas.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{rev.patientName[0]}</div>
                      <div className="reviewer-info">
                        <h4>{rev.patientName}</h4>
                        <span className="review-date">{rev.date}</span>
                      </div>
                      <div className="review-stars-display">
                        {renderStars(rev.stars)}
                      </div>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default DoctorProfile
