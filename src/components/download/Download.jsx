
import appStoreImg from "../../assets/appstore.png"
import googleplayImg from "../../assets/googleplay.png"
import appMobileImg from "../../assets/app-mobile.png"

import "./Download.css"

const Download = () => {
  return (

    <section className="download" id="download">
        <div className="download__container container">

            <div className="download__content">
            <h2 className="download__title">Lleva Quito<span className="navbar__logo--primary">Care</span> en tu celular</h2>
            
            <p className="download__description">
                Agenda citas, consulta especialistas y recibe atención médica
                desde cualquier lugar y en cualquier momento.
            </p>

            <div className="download__stores">
                <a href="#" className="download__store">
                <img
                src={appStoreImg}
                alt="Disponible en App Store"
                />
                </a>

                <a href="#" className="download__store">
                <img
                src={googleplayImg}
                alt="Disponible en Google Play"
                />
                </a>

            </div>

            </div>

            <div className="download__image">
            <img
            src={appMobileImg}
            alt="Aplicación móvil QuitoHampi"
            />
            </div>

        </div>
    </section>

  )
}

export default Download