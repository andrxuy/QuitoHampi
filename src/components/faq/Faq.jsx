
import "./Faq.css"

const Faq = () => {
  return (

    <section className="faq" id="faq">
        <div className="faq__container container">

            <div className="faq__header">
            <h2 className="faq__title">Preguntas frecuentes</h2>
            <p className="faq__description">Resolvemos las dudas más comunes sobre QuitoHampi</p>
            </div>

            <div className="faq__content">

                <details className="faq__item">
                <summary className="faq__question">¿Las consultas son seguras?</summary>
                <div className="faq__answer">
                    <p>
                    Sí, todas las consultas cuentan con protección y privacidad para garantizar la seguridad de tu información médica.
                    </p>
                </div>
                </details>

                <details className="faq__item">
                <summary className="faq__question">¿Necesito descargar alguna app?</summary>
                <div className="faq__answer">
                    <p>
                    No necesariamente. Puedes acceder a QuitoHampi desde cualquier navegador en tu celular, tablet o computadora.
                    </p>
                </div>
                </details>

                <details className="faq__item">
                <summary className="faq__question">¿Cómo agendo una cita?</summary>
                <div className="faq__answer">
                    <p>
                    Solo debes seleccionar la especialidad, elegir el horario disponible y completar tus datos para confirmar la cita.
                    </p>
                </div>
                </details>

                <details className="faq__item">
                <summary className="faq__question">¿Qué métodos de pago aceptan?</summary>
                <div className="faq__answer">
                    <p>
                    Aceptamos tarjetas de crédito, débito y otros métodos de pago digitales seguros.
                    </p>
                </div>
                </details>

                <details className="faq__item">
                <summary className="faq__question">¿Puedo cancelar una cita?</summary>
                <div className="faq__answer">
                    <p>
                    Sí, puedes cancelar o reprogramar tu cita desde la plataforma antes de la hora establecida.
                    </p>
                </div>
                </details>

                <details className="faq__item">
                <summary className="faq__question">¿Problemas con la conexión?</summary>
                <div className="faq__answer">
                    <p>
                    Si tienes inconvenientes durante la consulta, puedes volver a conectarte o contactar a nuestro soporte técnico.
                    </p>
                </div>
                </details>

            </div>

        </div>
    </section>

  )
}

export default Faq