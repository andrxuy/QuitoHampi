import doctorImg from "../../assets/doctora.png"

import "./About.css"

const About = () => {
  return (

    <section id="informacion" className="informacion">
        <div className="informacion__contenedor container">

            <div className="informacion__imagen">
            <img src={doctorImg} alt="Doctora" loading="lazy"/>
            </div>

            <div className="informacion__contenido">
            <p className="informacion__subtitulo">SOBRE QUITOCARE</p>

            <h2 className="informacion__titulo">
                Atención médica digital segura y confiable
            </h2>

            <p className="informacion__descripcion">
                QuitoHampi conecta a pacientes con doctores certificados a través de consultas en línea,
                ofreciendo un servicio rápido, seguro y accesible en Quito.
            </p>

            <a href="#" className="informacion__boton">Conoce más</a>
            </div>

        </div>
    </section>

  )
}

export default About