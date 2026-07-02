import './Dashboard.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import TypeIt from 'typeit-react'
import { db } from '../utils/db'

const Dashboard = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const [activeTab, setActiveTab] = useState('resumen') // admin: resumen, verificacion, especialidades, resenas, pacientes | medico: calendario
  const navigate = useNavigate()

  // --- STATE FOR MOCK DATA ---
  const [users, setUsers] = useState([])
  const [specialties, setSpecialties] = useState([])
  const [suggestedSpecialties, setSuggestedSpecialties] = useState([])
  const [reviews, setReviews] = useState([])
  const [appointments, setAppointments] = useState([])
  const [restDays, setRestDays] = useState([])

  // --- MODALS & FORM STATES ---
  const [showModal, setShowModal] = useState(null) // 'viewDoc', 'editDoc', 'addSpec', 'editSpec', 'viewHistory', 'viewAppt', 'restDay', 'confirmAction'
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [confirmCallback, setConfirmCallback] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState('')

  // --- FILTERS ---
  const [doctorSearch, setDoctorSearch] = useState('')
  const [doctorSpecFilter, setDoctorSpecFilter] = useState('')
  const [doctorStatusFilter, setDoctorStatusFilter] = useState('')

  const [patientSearch, setPatientSearch] = useState('')

  const [reviewSearch, setReviewSearch] = useState('')
  const [reviewStatusFilter, setReviewStatusFilter] = useState('Todas')

  const [specialtySearch, setSpecialtySearch] = useState('')

  // --- LOAD DATA ---
  useEffect(() => {
    db.init()
    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    if (!user) {
      navigate('/login')
      return
    }
    setCurrentUser(user)
    
    // Set default tab based on role
    if (user.role === 'admin') {
      setActiveTab('resumen')
    } else if (user.role === 'medico') {
      setActiveTab('calendario')
    } else {
      setActiveTab('paciente_citas')
    }

    refreshData()
  }, [navigate])

  const refreshData = () => {
    setUsers(db.getUsers())
    setSpecialties(db.getSpecialties())
    setSuggestedSpecialties(db.getSuggestedSpecialties())
    setReviews(db.getReviews())
    setAppointments(db.getAppointments())
    setRestDays(db.getRestDays())
  }

  const handleLogout = () => {
    localStorage.removeItem('quitohampi_current_user')
    navigate('/login')
  }

  // --- CONFIRMATION MODAL HELPER ---
  const triggerConfirmation = (message, onConfirm) => {
    setConfirmMessage(message)
    setConfirmCallback(() => () => {
      onConfirm()
      setShowModal(null)
      refreshData()
    })
    setShowModal('confirmAction')
  }

  // =========================================================================
  // --- ADMIN ACTIONS ---
  // =========================================================================

  // HU-ADM-002: Verificación de médicos
  const handleApproveDoctor = (email) => {
    triggerConfirmation('¿Está seguro de que desea APROBAR a este especialista médico?', () => {
      db.updateUser(email, { estado: 'Verificado' })
    })
  }

  const handleRejectDoctor = (email) => {
    triggerConfirmation('¿Está seguro de que desea RECHAZAR la solicitud de este médico?', () => {
      db.updateUser(email, { estado: 'Rechazado' })
    })
  }

  // HU-ADM-003 & HU-ADM-006: Gestión de Médicos
  const handleSaveEditDoctor = (e) => {
    e.preventDefault()
    db.updateUser(selectedItem.email, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      especialidad: formData.especialidad,
      telefono: formData.telefono,
      edad: parseInt(formData.edad)
    })
    setShowModal(null)
    refreshData()
  }

  const handleDeleteDoctor = (email) => {
    triggerConfirmation('¿Está seguro de que desea ELIMINAR permanentemente a este médico del sistema?', () => {
      db.deleteUser(email)
    })
  }

  // HU-ADM-004: Gestión de Especialidades (CRUD)
  const handleAddSpecialty = (e) => {
    e.preventDefault()
    const res = db.addSpecialty(formData.name)
    if (res.success) {
      setShowModal(null)
      refreshData()
    } else {
      alert(res.message)
    }
  }

  const handleSaveEditSpecialty = (e) => {
    e.preventDefault()
    const res = db.updateSpecialty(selectedItem.id, formData.name)
    if (res.success) {
      setShowModal(null)
      refreshData()
    } else {
      alert(res.message)
    }
  }

  const handleToggleSpecialty = (id, currentStatus) => {
    const actionStr = currentStatus === 'Activo' ? 'DESACTIVAR' : 'ACTIVAR';
    triggerConfirmation(`¿Está seguro de que desea ${actionStr} esta especialidad?`, () => {
      db.toggleSpecialty(id)
    })
  }

  const handleIntegrateSpecialty = (id) => {
    triggerConfirmation('¿Desea integrar esta especialidad sugerida a la oferta oficial de QuitoHampi?', () => {
      db.integrateSuggestedSpecialty(id)
    })
  }

  const generateSpecialtiesReport = () => {
    const reportContent = `INFORME DE ESPECIALIDADES SUGERIDAS ("OTROS")\n` +
      `Generado el: ${new Date().toLocaleString()}\n` +
      `--------------------------------------------------\n\n` +
      suggestedSpecialties.map((s, idx) => `${idx + 1}. Especialidad: ${s.name}\n   Sugerida por: ${s.doctorName}\n   Fecha: ${s.date}\n`).join('\n') +
      `\nTotal sugeridas pendientes: ${suggestedSpecialties.length}`;
    
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'informe_especialidades_sugeridas.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  // HU-ADM-005: Gestión de Reseñas
  const handleToggleReviewVisibility = (id, currentStatus) => {
    const newStatus = currentStatus === 'Visible' ? 'Oculta' : 'Visible';
    const actionStr = newStatus === 'Oculta' ? 'OCULTAR (solo contenido ofensivo/falso)' : 'MOSTRAR';
    triggerConfirmation(`¿Está seguro de que desea ${actionStr} esta reseña?`, () => {
      db.updateReviewStatus(id, newStatus)
    })
  }

  const handleDeleteReview = (id) => {
    triggerConfirmation('¿Está seguro de que desea ELIMINAR permanentemente esta reseña por spam o falsedad?', () => {
      db.deleteReview(id)
    })
  }

  // Helper to highlight searched keyword in reviews
  const highlightText = (text, keyword) => {
    if (!keyword.trim()) return text;
    const regex = new RegExp(`(${keyword.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) => 
      regex.test(part) 
        ? <mark key={index} style={{ backgroundColor: '#FCF3CF', color: '#1A1A1A', padding: '0 2px', borderRadius: '3px' }}>{part}</mark> 
        : part
    );
  }

  // HU-ADM-006: Gestión de Pacientes
  const handleSaveEditPatient = (e) => {
    e.preventDefault()
    db.updateUser(selectedItem.email, {
      nombre: formData.nombre,
      apellido: formData.apellido,
      telefono: formData.telefono
    })
    setShowModal(null)
    refreshData()
  }

  const handleToggleBlockPatient = (email, currentStatus) => {
    const newStatus = currentStatus === 'Activo' ? 'Bloqueado' : 'Activo';
    const actionStr = newStatus === 'Bloqueado' ? 'BLOQUEAR' : 'DESBLOQUEAR';
    triggerConfirmation(`¿Está seguro de que desea ${actionStr} la cuenta de este paciente?`, () => {
      db.updateUser(email, { estado: newStatus })
    })
  }

  const handleDeletePatient = (email) => {
    triggerConfirmation('¿Está seguro de que desea ELIMINAR permanentemente el perfil de este paciente?', () => {
      db.deleteUser(email)
    })
  }

  // =========================================================================
  // --- DOCTOR ACTIONS ---
  // =========================================================================

  // HU-MED-003: Marcar día de descanso
  const handleSetRestDaySubmit = (e) => {
    e.preventDefault()
    const day = formData.restDay
    if (!day) return
    triggerConfirmation(`¿Está seguro de que desea marcar el ${day} como día de descanso? Todas las citas de este día serán canceladas automáticamente.`, () => {
      db.setRestDay(currentUser.email, day)
    })
    setShowModal(null)
  }

  const handleRemoveRestDay = (day) => {
    triggerConfirmation(`¿Desea habilitar nuevamente el día ${day} para atención de citas?`, () => {
      db.removeRestDay(currentUser.email, day)
    })
  }

  const handleCancelAppointment = (id) => {
    triggerConfirmation('¿Está seguro de que desea CANCELAR esta cita médica?', () => {
      db.cancelAppointment(id)
    })
  }

  // Helper to check if doctor is on rest day
  const isDoctorOnRestDay = (day) => {
    return restDays.some(r => r.doctorEmail.toLowerCase() === currentUser?.email?.toLowerCase() && r.day === day)
  }

  // Quick mock booking by doctor (interactive bonus!)
  const handleQuickBook = (day, time) => {
    const activePatients = users.filter(u => u.role === 'paciente' && u.estado === 'Activo')
    if (activePatients.length === 0) {
      alert('No hay pacientes activos disponibles para agendar.')
      return
    }
    setSelectedItem({ day, time })
    setFormData({ patientEmail: activePatients[0].email })
    setShowModal('quickBook')
  }

  const handleQuickBookSubmit = (e) => {
    e.preventDefault()
    const patient = users.find(u => u.email === formData.patientEmail)
    db.bookAppointment({
      doctorEmail: currentUser.email,
      patientName: `${patient.nombre} ${patient.apellido}`,
      patientEmail: patient.email,
      day: selectedItem.day,
      time: selectedItem.time,
      specialty: currentUser.especialidad
    })
    setShowModal(null)
    refreshData()
  }

  // =========================================================================
  // --- PATIENT ACTIONS (EXISTING PORTED) ---
  // =========================================================================
  const [patientAppointments, setPatientAppointments] = useState([
    { id: 1, date: '2026-06-16', time: '09:00', title: 'Consulta de Cardiología', doctor: 'Dr. Juan Pérez', status: 'confirmada' },
    { id: 2, date: '2026-06-17', time: '14:30', title: 'Revisión General', doctor: 'Dra. María Gómez', status: 'pendiente' }
  ])
  const [patientNewApp, setPatientNewApp] = useState({ date: '', time: '', title: '', doctor: '' })

  const handleAddPatientApp = (e) => {
    e.preventDefault()
    if (!patientNewApp.date || !patientNewApp.time || !patientNewApp.title || !patientNewApp.doctor) {
      alert('Completa todos los campos')
      return
    }
    const newApp = {
      id: Date.now(),
      ...patientNewApp,
      status: 'pendiente'
    }
    setPatientAppointments([newApp, ...patientAppointments])
    setPatientNewApp({ date: '', time: '', title: '', doctor: '' })
    setShowModal(null)
  }

  const handleDeletePatientApp = (id) => {
    if (window.confirm('¿Deseas cancelar esta cita?')) {
      setPatientAppointments(patientAppointments.filter(a => a.id !== id))
    }
  }

  // =========================================================================
  // --- RENDERING CONDITIONAL BLOCKS ---
  // =========================================================================

  if (!currentUser) return <div className="loading-screen">Cargando...</div>

  return (
    <div className="dashboard-layout">
      {/* 280px Wide Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-brand">
          <h2>Quito<span>Hampi</span></h2>
        </div>
        
        <div className="sidebar-user">
          <div className="user-avatar-circle">
            {currentUser.nombre[0]}
          </div>
          <div className="user-info">
            <p className="user-name">{currentUser.nombre} {currentUser.apellido}</p>
            <p className="user-role-badge">{currentUser.role === 'admin' ? 'Administrador' : currentUser.role === 'medico' ? 'Médico' : 'Paciente'}</p>
          </div>
        </div>

        <nav className="sidebar-menu">
          {currentUser.role === 'admin' && (
            <>
              <button className={`menu-item ${activeTab === 'resumen' ? 'active' : ''}`} onClick={() => setActiveTab('resumen')}>
                <i className="fa-solid fa-chart-line"></i> Resumen
              </button>
              <button className={`menu-item ${activeTab === 'verificacion' ? 'active' : ''}`} onClick={() => setActiveTab('verificacion')}>
                <i className="fa-solid fa-user-shield"></i> Verificación
                {users.filter(u => u.role === 'medico' && u.estado === 'Pendiente').length > 0 && (
                  <span className="count-badge">{users.filter(u => u.role === 'medico' && u.estado === 'Pendiente').length}</span>
                )}
              </button>
              <button className={`menu-item ${activeTab === 'especialidades' ? 'active' : ''}`} onClick={() => setActiveTab('especialidades')}>
                <i className="fa-solid fa-stethoscope"></i> Especialidades
              </button>
              <button className={`menu-item ${activeTab === 'resenas' ? 'active' : ''}`} onClick={() => setActiveTab('resenas')}>
                <i className="fa-solid fa-star"></i> Reseñas
              </button>
              <button className={`menu-item ${activeTab === 'pacientes' ? 'active' : ''}`} onClick={() => setActiveTab('pacientes')}>
                <i className="fa-solid fa-hospital-user"></i> Pacientes
              </button>
            </>
          )}

          {currentUser.role === 'medico' && (
            <>
              <button className={`menu-item ${activeTab === 'calendario' ? 'active' : ''}`} onClick={() => setActiveTab('calendario')}>
                <i className="fa-solid fa-calendar-week"></i> Mi Calendario
              </button>
            </>
          )}

          {currentUser.role === 'paciente' && (
            <>
              <button className={`menu-item ${activeTab === 'paciente_citas' ? 'active' : ''}`} onClick={() => setActiveTab('paciente_citas')}>
                <i className="fa-solid fa-calendar-check"></i> Mis Citas
              </button>
            </>
          )}

          <button className="menu-item logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="dashboard-main">
        {/* =================================================================== */}
        {/* ADMIN TAB: RESUMEN (HU-ADM-003) */}
        {/* =================================================================== */}
        {currentUser.role === 'admin' && activeTab === 'resumen' && (
          <div className="admin-view-tab animate-fade">
            <div className="tab-header">
              <h1>Tablero de Control</h1>
              <p>Visualiza el estado de la plataforma en tiempo real.</p>
            </div>

            {/* Metrics cards */}
            <div className="stats-cards-grid">
              <div className="stat-card-custom">
                <div className="stat-icon-wrapper">
                  <i className="fa-solid fa-user-doctor"></i>
                </div>
                <div className="stat-data">
                  <h3>{users.filter(u => u.role === 'medico').length}</h3>
                  <p>Médicos Registrados</p>
                </div>
              </div>
              <div className="stat-card-custom">
                <div className="stat-icon-wrapper">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="stat-data">
                  <h3>{users.filter(u => u.role === 'paciente').length}</h3>
                  <p>Pacientes Totales</p>
                </div>
              </div>
              <div className="stat-card-custom">
                <div className="stat-icon-wrapper">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
                <div className="stat-data">
                  <h3>{appointments.length}</h3>
                  <p>Citas Habilitadas</p>
                </div>
              </div>
              <div className="stat-card-custom">
                <div className="stat-icon-wrapper">
                  <i className="fa-solid fa-video"></i>
                </div>
                <div className="stat-data">
                  <h3>42</h3>
                  <p>Videoconsultas Realizadas</p>
                </div>
              </div>
            </div>

            {/* Doctors List Table */}
            <div className="table-section-card">
              <div className="table-header-controls">
                <h2>Directorio de Médicos</h2>
                
                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Buscar por apellido..."
                    value={doctorSearch}
                    onChange={(e) => setDoctorSearch(e.target.value)}
                    className="filter-input"
                  />
                  <select
                    value={doctorSpecFilter}
                    onChange={(e) => setDoctorSpecFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todas las especialidades</option>
                    {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                  </select>
                  <select
                    value={doctorStatusFilter}
                    onChange={(e) => setDoctorStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="">Todos los estados</option>
                    <option value="Verificado">Verificado</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>
              </div>

              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Foto</th>
                      <th>Nombre</th>
                      <th>Especialidad</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => u.role === 'medico')
                      .filter(u => !doctorSearch || u.apellido.toLowerCase().includes(doctorSearch.toLowerCase()))
                      .filter(u => !doctorSpecFilter || u.especialidad === doctorSpecFilter)
                      .filter(u => !doctorStatusFilter || u.estado === doctorStatusFilter)
                      .map((doc, idx) => (
                        <tr key={idx}>
                          <td>
                            <img src={doc.foto || 'https://via.placeholder.com/50'} alt={doc.nombre} className="table-doc-photo" />
                          </td>
                          <td className="font-semibold">{doc.nombre} {doc.apellido}</td>
                          <td>{doc.especialidad}</td>
                          <td>
                            <span className={`status-badge-custom ${doc.estado.toLowerCase()}`}>
                              {doc.estado}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="table-btn view" title="Ver Detalles" onClick={() => {
                                setSelectedItem(doc)
                                setShowModal('viewDoc')
                              }}>
                                <i className="fa-solid fa-eye"></i>
                              </button>
                              <button className="table-btn edit" title="Editar" onClick={() => {
                                setSelectedItem(doc)
                                setFormData({ ...doc })
                                setShowModal('editDoc')
                              }}>
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button className="table-btn delete" title="Eliminar" onClick={() => handleDeleteDoctor(doc.email)}>
                                <i className="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ADMIN TAB: VERIFICACIÓN (HU-ADM-002) */}
        {/* =================================================================== */}
        {currentUser.role === 'admin' && activeTab === 'verificacion' && (
          <div className="admin-view-tab animate-fade">
            <div className="tab-header">
              <h1>Verificación de Médicos</h1>
              <p>Evalúa las credenciales profesionales y aprueba o rechaza solicitudes de registro.</p>
            </div>

            <div className="table-section-card">
              <h2>Solicitudes Pendientes</h2>
              
              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Médico</th>
                      <th>Especialidad</th>
                      <th>Documentos</th>
                      <th>Fecha Registro</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'medico' && u.estado === 'Pendiente').length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-table-cell">No hay solicitudes pendientes de verificación.</td>
                      </tr>
                    ) : (
                      users
                        .filter(u => u.role === 'medico' && u.estado === 'Pendiente')
                        .map((doc, idx) => (
                          <tr key={idx}>
                            <td className="font-semibold">{doc.nombre} {doc.apellido}<br/><span className="sub-text">{doc.email}</span></td>
                            <td>{doc.especialidad}</td>
                            <td>
                              <button className="btn-link" onClick={() => {
                                setSelectedItem(doc)
                                setShowModal('viewDocFiles')
                              }}>
                                <i className="fa-solid fa-file-invoice"></i> Ver ({doc.documentos?.length || 0} archivos)
                              </button>
                            </td>
                            <td>{doc.fechaRegistro || '2026-06-30'}</td>
                            <td>
                              <div className="action-buttons-flex">
                                <button className="btn-approve" onClick={() => handleApproveDoctor(doc.email)}>
                                  <i className="fa-solid fa-check"></i> Aprobar
                                </button>
                                <button className="btn-reject" onClick={() => handleRejectDoctor(doc.email)}>
                                  <i className="fa-solid fa-xmark"></i> Rechazar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ADMIN TAB: ESPECIALIDADES (HU-ADM-004) */}
        {/* =================================================================== */}
        {currentUser.role === 'admin' && activeTab === 'especialidades' && (
          <div className="admin-view-tab animate-fade">
            <div className="tab-header">
              <h1>Gestión de Especialidades</h1>
              <p>Crea, edita y desactiva especialidades médicas disponibles en el sistema.</p>
            </div>

            <div className="specialties-grid-layout">
              {/* Official Specialties */}
              <div className="table-section-card">
                <div className="table-header-controls">
                  <h2>Especialidades Oficiales</h2>
                  <button className="btn-add-primary" onClick={() => {
                    setFormData({ name: '' })
                    setShowModal('addSpec')
                  }}>
                    + Nueva Especialidad
                  </button>
                </div>

                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Buscar especialidad..."
                    value={specialtySearch}
                    onChange={(e) => setSpecialtySearch(e.target.value)}
                    className="filter-input width-full"
                  />
                </div>

                <div className="table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Nombre</th>
                        <th>Estado</th>
                        <th>Creado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {specialties
                        .filter(s => !specialtySearch || s.name.toLowerCase().includes(specialtySearch.toLowerCase()))
                        .map((spec, idx) => (
                          <tr key={spec.id}>
                            <td>{idx + 1}</td>
                            <td className="font-semibold">{spec.name}</td>
                            <td>
                              <span className={`status-badge-custom ${spec.status === 'Activo' ? 'verificado' : 'rechazado'}`}>
                                {spec.status}
                              </span>
                            </td>
                            <td>{spec.createdAt}</td>
                            <td>
                              <div className="table-actions">
                                <button className="table-btn edit" title="Editar Nombre" onClick={() => {
                                  setSelectedItem(spec)
                                  setFormData({ name: spec.name })
                                  setShowModal('editSpec')
                                }}>
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button 
                                  className={`table-btn ${spec.status === 'Activo' ? 'deactivate' : 'activate'}`} 
                                  title={spec.status === 'Activo' ? 'Desactivar' : 'Activar'}
                                  onClick={() => handleToggleSpecialty(spec.id, spec.status)}
                                >
                                  <i className={`fa-solid ${spec.status === 'Activo' ? 'fa-ban' : 'fa-circle-check'}`}></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Suggested Specialties ("Otros") */}
              <div className="table-section-card">
                <div className="table-header-controls">
                  <h2>Sugerencias de Médicos ("Otros")</h2>
                  <button className="btn-secondary-custom" onClick={generateSpecialtiesReport}>
                    <i className="fa-solid fa-file-arrow-down"></i> Descargar Informe
                  </button>
                </div>

                <div className="table-wrapper">
                  <table className="custom-table">
                    <thead>
                      <tr>
                        <th>Especialidad Sugerida</th>
                        <th>Médico Solicitante</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {suggestedSpecialties.length === 0 ? (
                        <tr>
                          <td colSpan="3" className="empty-table-cell">No hay especialidades sugeridas pendientes.</td>
                        </tr>
                      ) : (
                        suggestedSpecialties.map((sugg) => (
                          <tr key={sugg.id}>
                            <td className="font-semibold">{sugg.name}</td>
                            <td>{sugg.doctorName}<br/><span className="sub-text">{sugg.date}</span></td>
                            <td>
                              <button className="btn-approve small" onClick={() => handleIntegrateSpecialty(sugg.id)}>
                                <i className="fa-solid fa-plus"></i> Integrar
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ADMIN TAB: RESEÑAS (HU-ADM-005) */}
        {/* =================================================================== */}
        {currentUser.role === 'admin' && activeTab === 'resenas' && (
          <div className="admin-view-tab animate-fade">
            <div className="tab-header">
              <h1>Gestión de Reseñas</h1>
              <p>Modera calificaciones y opiniones. Oculta contenido inapropiado o falso y elimina spam.</p>
            </div>

            <div className="table-section-card">
              <div className="table-header-controls">
                <h2>Reseñas y Calificaciones</h2>
                
                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Filtrar por palabra clave..."
                    value={reviewSearch}
                    onChange={(e) => setReviewSearch(e.target.value)}
                    className="filter-input"
                  />
                  <select
                    value={reviewStatusFilter}
                    onChange={(e) => setReviewStatusFilter(e.target.value)}
                    className="filter-select"
                  >
                    <option value="Todas">Todas las reseñas</option>
                    <option value="Visible">Visibles</option>
                    <option value="Oculta">Ocultas</option>
                  </select>
                </div>
              </div>

              {/* Grid of Reviews */}
              <div className="reviews-grid-container">
                {reviews
                  .filter(r => reviewStatusFilter === 'Todas' || r.status === reviewStatusFilter)
                  .filter(r => !reviewSearch || r.comment.toLowerCase().includes(reviewSearch.toLowerCase()))
                  .length === 0 ? (
                    <div className="empty-reviews-state">No se encontraron reseñas con los filtros seleccionados.</div>
                  ) : (
                    reviews
                      .filter(r => reviewStatusFilter === 'Todas' || r.status === reviewStatusFilter)
                      .filter(r => !reviewSearch || r.comment.toLowerCase().includes(reviewSearch.toLowerCase()))
                      .map((rev) => (
                        <div key={rev.id} className={`review-card-item ${rev.status === 'Oculta' ? 'hidden-opacity' : ''}`}>
                          <div className="review-card-top">
                            <div className="review-card-patient">
                              <div className="patient-avatar-placeholder">
                                {rev.patientName[0]}
                              </div>
                              <div>
                                <h4>{rev.patientName}</h4>
                                <p className="sub-text">Calificó a: <span className="font-semibold">{rev.doctorName}</span></p>
                              </div>
                            </div>
                            <div className="review-card-stars">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-solid fa-star ${i < rev.stars ? 'star-filled' : 'star-empty'}`}></i>
                              ))}
                            </div>
                          </div>

                          <div className="review-card-body">
                            <p>{highlightText(rev.comment, reviewSearch)}</p>
                            <span className="review-date">{rev.date}</span>
                          </div>

                          <div className="review-card-footer-actions">
                            <button 
                              className={`btn-outline-action ${rev.status === 'Visible' ? 'hide-review' : 'show-review'}`}
                              onClick={() => handleToggleReviewVisibility(rev.id, rev.status)}
                            >
                              <i className={`fa-solid ${rev.status === 'Visible' ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                              {rev.status === 'Visible' ? ' Ocultar' : ' Mostrar'}
                            </button>
                            <button className="btn-outline-action delete-review" onClick={() => handleDeleteReview(rev.id)}>
                              <i className="fa-solid fa-trash-can"></i> Eliminar
                            </button>
                          </div>
                        </div>
                      ))
                  )}
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* ADMIN TAB: PACIENTES (HU-ADM-006) */}
        {/* =================================================================== */}
        {currentUser.role === 'admin' && activeTab === 'pacientes' && (
          <div className="admin-view-tab animate-fade">
            <div className="tab-header">
              <h1>Gestión de Pacientes</h1>
              <p>Consulta el historial, edita información y bloquea o elimina cuentas de usuarios pacientes.</p>
            </div>

            <div className="table-section-card">
              <div className="table-header-controls">
                <h2>Directorio de Pacientes</h2>
                
                <div className="filters-row">
                  <input
                    type="text"
                    placeholder="Buscar por nombre o correo..."
                    value={patientSearch}
                    onChange={(e) => setPatientSearch(e.target.value)}
                    className="filter-input width-large"
                  />
                </div>
              </div>

              <div className="table-wrapper">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Teléfono</th>
                      <th>Fecha Registro</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u => u.role === 'paciente')
                      .filter(u => !patientSearch || u.nombre.toLowerCase().includes(patientSearch.toLowerCase()) || u.apellido.toLowerCase().includes(patientSearch.toLowerCase()) || u.email.toLowerCase().includes(patientSearch.toLowerCase()))
                      .map((pat, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td className="font-semibold">{pat.nombre} {pat.apellido}</td>
                          <td>{pat.email}</td>
                          <td>{pat.telefono}</td>
                          <td>{pat.fechaRegistro || '2026-06-01'}</td>
                          <td>
                            <span className={`status-badge-custom ${pat.estado === 'Activo' ? 'verificado' : 'rechazado'}`}>
                              {pat.estado}
                            </span>
                          </td>
                          <td>
                            <div className="table-actions">
                              <button className="table-btn view" title="Ver Historial" onClick={() => {
                                setSelectedItem(pat)
                                setShowModal('viewHistory')
                              }}>
                                <i className="fa-solid fa-clock-rotate-left"></i>
                              </button>
                              <button className="table-btn edit" title="Editar Perfil" onClick={() => {
                                setSelectedItem(pat)
                                setFormData({ ...pat })
                                setShowModal('editPatient')
                              }}>
                                <i className="fa-solid fa-user-pen"></i>
                              </button>
                              <button 
                                className={`table-btn ${pat.estado === 'Activo' ? 'deactivate' : 'activate'}`}
                                title={pat.estado === 'Activo' ? 'Bloquear Cuenta' : 'Desbloquear'}
                                onClick={() => handleToggleBlockPatient(pat.email, pat.estado)}
                              >
                                <i className={`fa-solid ${pat.estado === 'Activo' ? 'fa-user-lock' : 'fa-user-check'}`}></i>
                              </button>
                              <button className="table-btn delete" title="Eliminar Perfil" onClick={() => handleDeletePatient(pat.email)}>
                                <i className="fa-solid fa-user-minus"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* DOCTOR TAB: CALENDARIO SEMANAL (HU-MED-003) */}
        {/* =================================================================== */}
        {currentUser.role === 'medico' && activeTab === 'calendario' && (
          <div className="doctor-view-tab animate-fade">
            <div className="doctor-header-dashboard">
              <div className="doctor-header-info">
                <h1>Calendario de Citas Semanal</h1>
                <p>Médico Especialista: <span className="highlight-text">{currentUser.nombre} {currentUser.apellido}</span> | Área: <span className="highlight-text">{currentUser.especialidad}</span></p>
              </div>
              <div className="doctor-header-actions">
                <button className="btn-add-primary" onClick={() => {
                  setFormData({ restDay: 'Lunes' })
                  setShowModal('restDay')
                }}>
                  <i className="fa-solid fa-bed"></i> Marcar Día de Descanso
                </button>
              </div>
            </div>

            {/* Días de descanso activos */}
            {db.getDoctorRestDays(currentUser.email).length > 0 && (
              <div className="rest-days-banner">
                <span className="banner-title"><i className="fa-solid fa-circle-info"></i> Días de descanso configurados:</span>
                <div className="rest-days-tags">
                  {db.getDoctorRestDays(currentUser.email).map((day, i) => (
                    <span key={i} className="rest-day-tag">
                      {day} <button onClick={() => handleRemoveRestDay(day)}>✕</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Calendar Legend */}
            <div className="calendar-legend-bar">
              <div className="legend-item">
                <span className="legend-box disponible"></span>
                <span>Disponible (Habilitado)</span>
              </div>
              <div className="legend-item">
                <span className="legend-box ocupado"></span>
                <span>Ocupado (Cita Agendada)</span>
              </div>
              <div className="legend-item">
                <span className="legend-box descanso"></span>
                <span>Día de Descanso (Bloqueado)</span>
              </div>
            </div>

            {/* Calendar Table */}
            <div className="calendar-grid-card">
              <div className="table-wrapper">
                <table className="calendar-table">
                  <thead>
                    <tr>
                      <th>Hora</th>
                      <th>Lunes</th>
                      <th>Martes</th>
                      <th>Miércoles</th>
                      <th>Jueves</th>
                      <th>Viernes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'].map((time) => (
                      <tr key={time}>
                        <td className="time-col">{time}</td>
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((day) => {
                          const isRest = isDoctorOnRestDay(day)
                          const appt = appointments.find(
                            a => a.doctorEmail.toLowerCase() === currentUser.email.toLowerCase() && a.day === day && a.time === time
                          )

                          if (isRest) {
                            return (
                              <td key={day} className="slot-rest">
                                <div className="slot-container">
                                  <span className="slot-status">Descanso</span>
                                </div>
                              </td>
                            )
                          }

                          if (appt) {
                            return (
                              <td key={day} className="slot-occupied" onClick={() => {
                                setSelectedItem(appt)
                                setShowModal('viewAppt')
                              }}>
                                <div className="slot-container">
                                  <span className="slot-status">Ocupado</span>
                                  <span className="patient-name-slot">{appt.patientName}</span>
                                </div>
                              </td>
                            )
                          }

                          return (
                            <td key={day} className="slot-available" onClick={() => handleQuickBook(day, time)}>
                              <div className="slot-container">
                                <span className="slot-status">+ Disponible</span>
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* PATIENT TAB: CLINICAL PORTAL (EXISTING RESCALE) */}
        {/* =================================================================== */}
        {currentUser.role === 'paciente' && activeTab === 'paciente_citas' && (
          <div className="patient-view-tab animate-fade">
            <div className="dashboard-header">
              <h1 className="dashboard-title">
                <TypeIt options={{ speed: 100, waitUntilVisible: true, cursor: false }}>
                  Mi Portal <span className="highlight">QuitoHampi</span>
                </TypeIt>
              </h1>
              <button onClick={() => {
                setPatientNewApp({ date: '', time: '', title: '', doctor: '' })
                setShowModal('newPatientApp')
              }} className="btn-primary">
                + Nueva Cita
              </button>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-number">{patientAppointments.length}</div>
                <div className="stat-label">Total Citas</div>
              </div>
              <div className="stat-card green">
                <div className="stat-number">{patientAppointments.filter(a => a.status === 'confirmada').length}</div>
                <div className="stat-label">Confirmadas</div>
              </div>
              <div className="stat-card orange">
                <div className="stat-number">{patientAppointments.filter(a => a.status === 'pendiente').length}</div>
                <div className="stat-label">Pendientes</div>
              </div>
            </div>

            <div className="appointments-section">
              <h3 className="section-title">Mis Citas</h3>
              <div className="appointments-list">
                {patientAppointments.length === 0 ? (
                  <div className="empty">No tienes citas agendadas.</div>
                ) : (
                  patientAppointments.map(app => (
                    <div key={app.id} className={`appointment-item ${app.status}`}>
                      <div className="appointment-info">
                        <div className="appointment-date">{app.date} - {app.time}</div>
                        <div className="appointment-title">{app.title}</div>
                        <div className="appointment-doctor">{app.doctor}</div>
                      </div>
                      <div className="appointment-actions">
                        <span className={`status-badge ${app.status}`}>{app.status}</span>
                        <button onClick={() => handleDeletePatientApp(app.id)} className="delete-btn">✕</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODALS RENDERER */}
      {/* ========================================================================= */}

      {/* Modal: View Doctor Details */}
      {showModal === 'viewDoc' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Detalles del Especialista</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <div className="doc-details-modal-grid">
              <div className="doc-details-sidebar">
                <img src={selectedItem.foto || 'https://via.placeholder.com/150'} alt={selectedItem.nombre} className="details-avatar" />
                <h3>{selectedItem.nombre} {selectedItem.apellido}</h3>
                <p className="details-spec-tag">{selectedItem.especialidad}</p>
                <span className={`status-badge-custom ${selectedItem.estado.toLowerCase()} margin-top-1`}>{selectedItem.estado}</span>
              </div>
              <div className="doc-details-main">
                <div className="details-section">
                  <h4>Información Personal</h4>
                  <p><strong>Correo electrónico:</strong> {selectedItem.email}</p>
                  <p><strong>Teléfono:</strong> {selectedItem.telefono || 'No registrado'}</p>
                  <p><strong>Edad:</strong> {selectedItem.edad ? `${selectedItem.edad} años` : 'No registrado'}</p>
                </div>
                <div className="details-section">
                  <h4>Educación y Títulos</h4>
                  <p>{selectedItem.titulos || 'No registrados'}</p>
                </div>
                <div className="details-section">
                  <h4>Certificaciones</h4>
                  <p>{selectedItem.certificaciones || 'No registradas'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Doctor */}
      {showModal === 'editDoc' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Editar Médico</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <form onSubmit={handleSaveEditDoctor} className="modal-form">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input type="text" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Especialidad</label>
                <select value={formData.especialidad} onChange={(e) => setFormData({...formData, especialidad: e.target.value})} required>
                  {specialties.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Edad</label>
                <input type="number" value={formData.edad} onChange={(e) => setFormData({...formData, edad: e.target.value})} required />
              </div>
              <button type="submit" className="btn-save-modal">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Doctor Documents */}
      {showModal === 'viewDocFiles' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Documentación del Médico</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <div className="modal-body-content">
              <p><strong>Médico:</strong> {selectedItem.nombre} {selectedItem.apellido}</p>
              <p><strong>Especialidad:</strong> {selectedItem.especialidad}</p>
              
              <h4 className="margin-top-1">Archivos subidos (Verificación):</h4>
              <div className="docs-modal-list">
                {selectedItem.documentos && selectedItem.documentos.length > 0 ? (
                  selectedItem.documentos.map((doc, idx) => (
                    <div key={idx} className="doc-item-row">
                      <div className="doc-item-name-info">
                        <i className="fa-solid fa-file-pdf file-icon-blue"></i>
                        <div>
                          <span className="doc-item-title">{doc.name}</span>
                          <span className="doc-item-size">{doc.size}</span>
                        </div>
                      </div>
                      <a href="#" className="btn-view-doc" onClick={(e) => { e.preventDefault(); alert(`Descarga simulada para ${doc.name}`); }}>
                        <i className="fa-solid fa-download"></i>
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="no-docs-text">No se adjuntaron documentos de respaldo.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Specialty */}
      {showModal === 'addSpec' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Nueva Especialidad</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <form onSubmit={handleAddSpecialty} className="modal-form">
              <div className="form-group">
                <label>Nombre de Especialidad</label>
                <input type="text" placeholder="Ej: Neurología" value={formData.name} onChange={(e) => setFormData({name: e.target.value})} required />
              </div>
              <button type="submit" className="btn-save-modal">Crear Especialidad</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Specialty */}
      {showModal === 'editSpec' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Editar Especialidad</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <form onSubmit={handleSaveEditSpecialty} className="modal-form">
              <div className="form-group">
                <label>Nombre de Especialidad</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({name: e.target.value})} required />
              </div>
              <button type="submit" className="btn-save-modal">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Patient History */}
      {showModal === 'viewHistory' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Historial del Paciente</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <div className="patient-history-modal-body">
              <h3>{selectedItem.nombre} {selectedItem.apellido}</h3>
              <p className="sub-text">Contacto: {selectedItem.email} | Teléfono: {selectedItem.telefono}</p>

              <div className="history-section margin-top-1">
                <h4>Citas Agendadas y Canceladas</h4>
                <div className="history-table-wrapper">
                  <table className="custom-table small">
                    <thead>
                      <tr>
                        <th>Fecha/Hora</th>
                        <th>Médico</th>
                        <th>Especialidad</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.filter(a => a.patientEmail.toLowerCase() === selectedItem.email.toLowerCase()).length === 0 ? (
                        <tr>
                          <td colSpan="4" className="empty-table-cell">No hay registro de citas en el sistema.</td>
                        </tr>
                      ) : (
                        appointments
                          .filter(a => a.patientEmail.toLowerCase() === selectedItem.email.toLowerCase())
                          .map((appt) => (
                            <tr key={appt.id}>
                              <td>{appt.day} {appt.time}</td>
                              <td>{appt.doctorEmail === 'doctor@quitohampi.com' ? 'Dr. Juan Pérez' : appt.doctorEmail}</td>
                              <td>{appt.specialty}</td>
                              <td><span className="status-badge-custom verificado">Agendada</span></td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="history-section margin-top-1">
                <h4>Reseñas y Opiniones Dejadas</h4>
                <div className="history-reviews-list">
                  {reviews.filter(r => r.patientEmail.toLowerCase() === selectedItem.email.toLowerCase()).length === 0 ? (
                    <p className="no-docs-text">El paciente no ha redactado ninguna reseña.</p>
                  ) : (
                    reviews
                      .filter(r => r.patientEmail.toLowerCase() === selectedItem.email.toLowerCase())
                      .map((rev) => (
                        <div key={rev.id} className="history-review-item-card">
                          <div className="history-review-header">
                            <span>Para: <strong>{rev.doctorName}</strong></span>
                            <span className="review-card-stars">
                              {[...Array(5)].map((_, i) => (
                                <i key={i} className={`fa-solid fa-star ${i < rev.stars ? 'star-filled' : 'star-empty'}`}></i>
                              ))}
                            </span>
                          </div>
                          <p>"{rev.comment}"</p>
                          <span className="review-date">{rev.date}</span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Edit Patient */}
      {showModal === 'editPatient' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Editar Paciente</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <form onSubmit={handleSaveEditPatient} className="modal-form">
              <div className="form-group">
                <label>Nombre</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Apellido</label>
                <input type="text" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" value={formData.telefono} onChange={(e) => setFormData({...formData, telefono: e.target.value})} required />
              </div>
              <button type="submit" className="btn-save-modal">Guardar Cambios</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Doctor Rest Day Selector */}
      {showModal === 'restDay' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Configurar Día de Descanso</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <form onSubmit={handleSetRestDaySubmit} className="modal-form">
              <div className="form-group">
                <label>Seleccione el Día de Descanso</label>
                <select value={formData.restDay} onChange={(e) => setFormData({restDay: e.target.value})} required>
                  <option value="Lunes">Lunes</option>
                  <option value="Martes">Martes</option>
                  <option value="Miércoles">Miércoles</option>
                  <option value="Jueves">Jueves</option>
                  <option value="Viernes">Viernes</option>
                </select>
              </div>
              <p className="modal-help-text-warning"><i className="fa-solid fa-triangle-exclamation"></i> Al marcar este día como descanso, se cancelarán todas las citas agendadas correspondientes en tu agenda semanal.</p>
              <button type="submit" className="btn-save-modal">Guardar Descanso</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Doctor Appointment details */}
      {showModal === 'viewAppt' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Detalles de la Cita Médica</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <div className="modal-body-content">
              <p><strong>Paciente:</strong> {selectedItem.patientName}</p>
              <p><strong>Email Paciente:</strong> {selectedItem.patientEmail}</p>
              <p><strong>Día:</strong> {selectedItem.day}</p>
              <p><strong>Hora:</strong> {selectedItem.time}</p>
              <p><strong>Especialidad:</strong> {selectedItem.specialty}</p>

              <div className="modal-actions-spacing">
                <button className="btn-cancel-appt-modal" onClick={() => {
                  setShowModal(null)
                  handleCancelAppointment(selectedItem.id)
                }}>
                  Cancelar Cita
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Quick Book Appointment by Doctor */}
      {showModal === 'quickBook' && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-custom">
              <h2>Agendar Cita Rápida</h2>
              <button onClick={() => setShowModal(null)} className="close-btn-modal">✕</button>
            </div>
            <form onSubmit={handleQuickBookSubmit} className="modal-form">
              <p><strong>Día:</strong> {selectedItem.day} | <strong>Hora:</strong> {selectedItem.time}</p>
              <div className="form-group">
                <label>Seleccione el Paciente</label>
                <select value={formData.patientEmail} onChange={(e) => setFormData({patientEmail: e.target.value})} required>
                  {users.filter(u => u.role === 'paciente' && u.estado === 'Activo').map(p => (
                    <option key={p.email} value={p.email}>{p.nombre} {p.apellido} ({p.email})</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-save-modal">Reservar Slot</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Patient New Appointment (Clinical Portal) */}
      {showModal === 'newPatientApp' && (
        <div className="modal-overlay" onClick={() => setShowModal(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva Cita</h2>
              <button onClick={() => setShowModal(null)} className="modal-close">✕</button>
            </div>
            <form onSubmit={handleAddPatientApp}>
              <div className="form-group">
                <label>Fecha</label>
                <input type="date" value={patientNewApp.date} onChange={(e) => setPatientNewApp({...patientNewApp, date: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Hora</label>
                <input type="time" value={patientNewApp.time} onChange={(e) => setPatientNewApp({...patientNewApp, time: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Título</label>
                <input type="text" placeholder="Ej: Consulta de Cardiología" value={patientNewApp.title} onChange={(e) => setPatientNewApp({...patientNewApp, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Doctor</label>
                <select value={patientNewApp.doctor} onChange={(e) => setPatientNewApp({...patientNewApp, doctor: e.target.value})} required>
                  <option value="">Selecciona un doctor</option>
                  {users.filter(u => u.role === 'medico' && u.estado === 'Verificado').map(d => (
                    <option key={d.email} value={`Dr. ${d.nombre} ${d.apellido}`}>{`Dr. ${d.nombre} ${d.apellido} (${d.especialidad})`}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn-primary full">Agendar Cita</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Confirmation Dialogue */}
      {showModal === 'confirmAction' && (
        <div className="modal-overlay-confirm">
          <div className="modal-content-confirm">
            <div className="confirm-icon-warning">
              <i className="fa-solid fa-circle-question"></i>
            </div>
            <h3>Confirmar Acción</h3>
            <p>{confirmMessage}</p>
            <div className="confirm-buttons-row">
              <button className="confirm-btn-yes" onClick={confirmCallback}>Sí, confirmar</button>
              <button className="confirm-btn-no" onClick={() => setShowModal(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard