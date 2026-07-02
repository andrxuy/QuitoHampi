import './HowItWorks.css'

const HowItWorks = () => {
  const steps = [
    {
      icon: 'fa-solid fa-magnifying-glass',
      title: 'Busca tu especialista',
      description: 'Elige entre más de 10 especialidades médicas y encuentra al doctor ideal para ti.'
    },
    {
      icon: 'fa-solid fa-map-location-dot',
      title: 'Encuéntralo en el mapa',
      description: 'Visualiza la ubicación exacta de cada consultorio en el mapa interactivo de Quito.'
    },
    {
      icon: 'fa-solid fa-calendar-check',
      title: 'Agenda tu cita',
      description: 'Selecciona el día y hora disponible, elige cita presencial o virtual, y confirma en segundos.'
    }
  ]

  return (
    <section id="como-funciona" className="how-it-works">
      <div className="container">
        <div className="how-header">
          <h2>Cómo funciona QuitoHampi</h2>
          <p>Encuentra atención médica de calidad en solo 3 pasos</p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div key={index} className="step-card" data-aos="fade-up" data-aos-delay={index * 150}>
              <div className="step-number">{index + 1}</div>
              <div className="step-icon">
                <i className={step.icon}></i>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
