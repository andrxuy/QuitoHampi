import './Header.css'
import { Link } from 'react-router'

const Header = () => {
  return (
    <header className="header">
      <nav className="nav__header container">

        <div className="nav__top">
          <h1 className="navbar_logo">
            Quito<span className="navbar__logo--primary">Hampi</span>
          </h1>
        </div>

        <ul className="nav__menu" id="navMenu">
          <li><Link to="/">Inicio</Link></li>
          <li><a href="#como-funciona">Cómo funciona</a></li>
          <li><a href="#busqueda">Buscar médico</a></li>
          <li>
            <Link to="/login" className="nav__login-btn">
              LOGIN
            </Link>
          </li>
        </ul>

      </nav>
    </header>
  )
}

export default Header
