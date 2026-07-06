
import "./Team.css"

const Team = () => {
  return (

    <section id="equipo" className="equipo">
        <div className="container">

            <div className="equipo__header">
            <p className="equipo__label">NUESTRO EQUIPO</p>
            <h2 className="equipo__titulo">Conoce a nuestros profesionales</h2>
            <p className="equipo__subtitulo">Especialistas certificados comprometidos con tu salud.</p>
            </div>

            <div className="equipo__grid">

            <article className="doctor">
                <div className="doctor__foto-wrapper">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Dr. Juan Pérez" className="doctor__foto"/>
                </div>
                <p className="doctor__nombre">Dr. Juan Pérez</p>
                <p className="doctor__especialidad">Medicina General</p>
                <div className="doctor__redes">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-solid fa-envelope"></i></a>
                </div>
            </article>

            <article className="doctor">
                <div className="doctor__foto-wrapper">
                <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Dra. María López" className="doctor__foto"/>
                </div>
                <p className="doctor__nombre">Dra. María López</p>
                <p className="doctor__especialidad">Pediatría</p>
                <div className="doctor__redes">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-solid fa-envelope"></i></a>
                </div>
            </article>

            <article className="doctor">
                <div className="doctor__foto-wrapper">
                <img src="https://randomuser.me/api/portraits/men/56.jpg" alt="Dr. Andrés Salazar" className="doctor__foto"/>
                </div>
                <p className="doctor__nombre">Dr. Andrés Salazar</p>
                <p className="doctor__especialidad">Cardiología</p>
                <div className="doctor__redes">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-solid fa-envelope"></i></a>
                </div>
            </article>

            <article className="doctor">
                <div className="doctor__foto-wrapper">
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Dra. Carolina Vega" className="doctor__foto"/>
                </div>
                <p className="doctor__nombre">Dra. Carolina Vega</p>
                <p className="doctor__especialidad">Psicología</p>
                <div className="doctor__redes">
                <a href="#"><i className="fa-brands fa-linkedin-in"></i></a>
                <a href="#"><i className="fa-solid fa-envelope"></i></a>
                </div>
            </article>

            </div>

        </div>
    </section>

  )
}

export default Team