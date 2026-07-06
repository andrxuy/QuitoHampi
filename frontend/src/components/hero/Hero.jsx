import heroImage from "../../assets/hero.png"

import './Hero.css'

const Hero = () => {
  return (
    
  <section id="hero" className="hero">
    <div className="hero__container container">

      <div className="hero__content">
        <h1 className="hero__title">
          El médico que necesitas <br />
          <span className="hero__highlight">a la vuelta de la esquina</span>
        </h1>

        <p className="hero__description">
          Conecta con doctores verificados en todo Quito. Busca por especialidad y ubicación, y agenda tu cita presencial o virtual en minutos.
        </p>

        <a href="#busqueda" className="hero__button">Buscar especialista</a>
      </div>

      <div className="hero__image">
        <img src={heroImage} alt="Doctora en telemedicina" loading="lazy"/>
      </div>
      
    </div>
  </section>

  )
}

export default Hero