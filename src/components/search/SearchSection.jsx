import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { db } from '../../utils/db'
import { Link } from 'react-router'
import 'leaflet/dist/leaflet.css'
import './SearchSection.css'

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
  className: 'blue-marker'
})

const SearchSection = () => {
  const [doctors, setDoctors] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredDoctors, setFilteredDoctors] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    const docs = db.getVerifiedDoctors()
    setDoctors(docs)
    setFilteredDoctors(docs)
    setSpecialties(db.getSpecialties())
    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    setCurrentUser(user)
  }, [])

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredDoctors(doctors)
      return
    }
    const term = searchTerm.toLowerCase()
    setFilteredDoctors(
      doctors.filter(d =>
        d.especialidad.toLowerCase().includes(term) ||
        d.nombre.toLowerCase().includes(term) ||
        d.apellido.toLowerCase().includes(term)
      )
    )
  }, [searchTerm, doctors])

  const renderStars = (stars) => {
    return [...Array(5)].map((_, i) => (
      <i key={i} className={`fa-solid fa-star ${i < stars ? 'star-filled' : 'star-empty'}`}></i>
    ))
  }

  const getDoctorStars = (docEmail) => {
    return parseFloat(db.getDoctorAverageStars(docEmail)) || 0
  }

  const agendarLink = (docEmail) => {
    if (currentUser && currentUser.role === 'paciente') {
      return `/panel-paciente/agendar/${encodeURIComponent(docEmail)}`
    }
    return `/agendar/${encodeURIComponent(docEmail)}`
  }

  return (
    <section id="busqueda" className="search-section">
      <div className="container">
        <div className="search-header">
          <h2>Encuentra a tu especialista</h2>
          <p>Busca por especialidad, nombre del doctor o ubicación</p>
        </div>

        <div className="search-input-wrapper">
          <i className="fa-solid fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Ej: Cardiología, Pediatría..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
            list="specialties-list"
          />
          <datalist id="specialties-list">
            {specialties.map(s => (
              <option key={s.id} value={s.name} />
            ))}
          </datalist>
        </div>

        <div className="map-container">
          <MapContainer
            center={[-0.1807, -78.4678]}
            zoom={13}
            style={{ height: '400px', width: '100%', borderRadius: '12px' }}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredDoctors.map((doc) => (
              doc.lat && doc.lng && (
                <Marker
                  key={doc.email}
                  position={[doc.lat, doc.lng]}
                  icon={blueIcon}
                >
                  <Popup>
                    <div className="popup-content">
                      <strong>{doc.nombre} {doc.apellido}</strong><br />
                      <span>{doc.especialidad}</span><br />
                      <span className="popup-stars">
                        {renderStars(getDoctorStars(doc.email))}
                      </span>
                      <br />
                      <Link to={`/doctor/${encodeURIComponent(doc.email)}`} className="popup-profile-btn">Ver perfil</Link>
                    </div>
                  </Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>

        <div className="results-count">
          {filteredDoctors.length} médico{filteredDoctors.length !== 1 ? 's' : ''} encontrado{filteredDoctors.length !== 1 ? 's' : ''}
        </div>

        <div className="doctors-grid">
          {filteredDoctors.map((doc) => (
            <div key={doc.email} className="doctor-card">
              <div className="doctor-card-photo">
                <img src={doc.foto || 'https://via.placeholder.com/150'} alt={`${doc.nombre} ${doc.apellido}`} />
              </div>
              <div className="doctor-card-info">
                <h3>{doc.nombre} {doc.apellido}</h3>
                <p className="doctor-card-specialty">{doc.especialidad}</p>
                <div className="doctor-card-stars">
                  {renderStars(getDoctorStars(doc.email))}
                  <span className="stars-text">({db.getDoctorReviews(doc.email).length})</span>
                </div>
                {doc.direccion && <p className="doctor-card-address"><i className="fa-solid fa-location-dot"></i> {doc.direccion}</p>}
              </div>
              <div className="doctor-card-actions">
                <Link to={`/doctor/${encodeURIComponent(doc.email)}`} className="btn-profile">Ver perfil</Link>
                {currentUser && currentUser.role === 'paciente' ? (
                  <Link to={`/panel-paciente/agendar/${encodeURIComponent(doc.email)}`} className="btn-appointment">Agendar cita</Link>
                ) : (
                  <Link to="/login" className="btn-appointment">Iniciar sesión para agendar</Link>
                )}
              </div>
            </div>
          ))}
          {filteredDoctors.length === 0 && (
            <div className="no-results">
              <i className="fa-solid fa-search"></i>
              <p>No se encontraron médicos con ese criterio de búsqueda.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default SearchSection
