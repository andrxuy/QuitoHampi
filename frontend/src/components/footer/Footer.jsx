import "./Footer.css"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

const Footer = () => {

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    })
  }, [])

  return (
    <footer className="footer">
      <div className="footer__container container">

        <div className="footer__brand" data-aos="fade-up" data-aos-delay="0">
          <h3 className="footer__logo">
            Quito
            <span className="footer__logo--highlight">Hampi</span>
          </h3>
          <p className="footer__description">
            Telemedicina en Quito rápida, fácil y segura
          </p>
          <div className="footer__social">
            <a href="#"><i className="fa-brands fa-facebook"></i></a>
            <a href="#"><i className="fa-brands fa-instagram"></i></a>
            <a href="#"><i className="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <div className="footer__links" data-aos="fade-up" data-aos-delay="100">
          <h4 className="footer__title">Enlaces</h4>
          <ul>
            <li><a href="#">Inicio</a></li>
            <li><a href="#">Servicios</a></li>
            <li><a href="#">Como funciona</a></li>
            <li><a href="#">Nosotros</a></li>
            <li><a href="#">Contacto</a></li>
          </ul>
        </div>

        <div className="footer__services" data-aos="fade-up" data-aos-delay="200">
          <h4 className="footer__title">Servicios</h4>
          <ul>
            <li><a href="#">Consulta en línea</a></li>
            <li><a href="#">Especialidades</a></li>
            <li><a href="#">Doctores</a></li>
            <li><a href="#">Preguntas frecuentes</a></li>
          </ul>
        </div>

        <div className="footer__contact" data-aos="fade-up" data-aos-delay="300">
          <h4 className="footer__title">Contacto</h4>
          <p>Quito, Ecuador</p>
          <p>info@quitohampi.com</p>
          <p>+593 98 496 9316</p>
        </div>

      </div>

      <div className="footer__bottom">
        <p>© 2026 QuitoHampi. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}

export default Footer
