import { useState, useEffect } from 'react'
import { Outlet, Link, useNavigate, useLocation } from 'react-router'
import './PatientPanel.css'

const PatientPanel = () => {
  const [currentUser, setCurrentUser] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('quitohampi_current_user'))
    if (!user || user.role !== 'paciente') {
      navigate('/login')
      return
    }
    setCurrentUser(user)
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('quitohampi_current_user')
    navigate('/login')
  }

  if (!currentUser) return <div className="panel-loading">Cargando...</div>

  const isActive = (path) => location.pathname === path ? 'active' : ''

  return (
    <div className="panel-layout">
      <aside className="panel-sidebar">
        <div className="panel-sidebar-brand">
          <h2>Quito<span>Hampi</span></h2>
        </div>

        <div className="panel-sidebar-user">
          <div className="panel-user-avatar">
            {currentUser.nombre[0]}
          </div>
          <div className="panel-user-info">
            <p className="panel-user-name">{currentUser.nombre} {currentUser.apellido}</p>
            <p className="panel-user-role">Paciente</p>
          </div>
        </div>

        <nav className="panel-sidebar-menu">
          <Link to="/panel-paciente/buscar" className={`panel-menu-item ${isActive('/panel-paciente/buscar')}`}>
            <i className="fa-solid fa-search"></i> Buscar médicos
          </Link>
          <Link to="/panel-paciente/citas" className={`panel-menu-item ${isActive('/panel-paciente/citas')}`}>
            <i className="fa-solid fa-calendar-check"></i> Mis citas
          </Link>
          <Link to="/panel-paciente/perfil" className={`panel-menu-item ${isActive('/panel-paciente/perfil')}`}>
            <i className="fa-solid fa-user"></i> Mi perfil
          </Link>
        </nav>

        <div className="panel-sidebar-footer">
          <button className="panel-logout-btn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="panel-main">
        <Outlet />
      </main>
    </div>
  )
}

export default PatientPanel
