import whiteCalendarImg from "../../assets/calendario-blanco.png"

import "./Cta.css"

const Cta = () => {
  return (

    <section id="cta" class="cta">
        <div class="cta__contenedor container">

            <div class="cta__icono">
            <img src={whiteCalendarImg}alt="Calendario"/>
            </div>
        
            <div class="cta__info">
            <h2 class="cta__titulo">¿Listo para cuidar tu salud?</h2>
            <p class="cta__texto">
                Agenda tu cita hoy y recibe atención médica de calidad
            </p>
            </div>

            <a href="#" class="cta__boton">Conoce más</a>

        </div>
    </section>

  )
}

export default Cta