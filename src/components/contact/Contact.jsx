
import "./Contact.css"

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="contact__container container">

        <div className="contact__form">
          <h2 className="contact__title">
            Registra tus datos
          </h2>

          <form>

            <p className="contact__description">
              Escribe la especialidad médica que necesitas
            </p>

            <input
              type="text"
              placeholder="Ej: Cardiología, Psicología..."
              className="contact__input"
              required
            />

            <p className="contact__description">
              Llena los siguientes items
            </p>

            <input
              type="text"
              placeholder="Nombre completo"
              className="contact__input"
              required
            />

            <input
              type="email"
              placeholder="Correo electrónico"
              className="contact__input"
              required
            />

            <input
              type="tel"
              placeholder="Número de celular"
              className="contact__input"
              required
            />

            <textarea
              placeholder="Describe el motivo de tu cita..."
              className="contact__textarea"
              required
            ></textarea>

            <div className="contact__check">
              <input
                type="checkbox"
                id="terms"
                required
              />

              <label htmlFor="terms">
                Acepto los términos y condiciones
              </label>
            </div>

            <button
              type="submit"
              className="contact__button"
            >
              Enviar
            </button>

          </form>
        </div>

        <div className="contact__map">
          <iframe
            src="https://www.google.com/maps?q=Quito,Ecuador&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Mapa de Quito"
          ></iframe>
        </div>

      </div>
    </section>
  );
};

export default Contact;