import "./Testimonials.css"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"

const testimonios = [
    {
        nombre: "María González",
        lugar:  "Quito, Ecuador",
        texto:  "La atención fue rápida y muy profesional. Pude resolver todas mis dudas desde casa.",
        foto:   "https://ui-avatars.com/api/?name=Maria+Gonzalez&background=2ECC71&color=fff&rounded=true",
    },
    {
        nombre: "Carlos Méndez",
        lugar:  "Quito, Ecuador",
        texto:  "Excelente plataforma, fácil de usar y los doctores son muy amables y capacitados.",
        foto:   "https://ui-avatars.com/api/?name=Carlos+Mendez&background=2ECC71&color=fff&rounded=true",
    },
    {
        nombre: "Ana Ruiz",
        lugar:  "Quito, Ecuador",
        texto:  "Agendar una cita es súper sencillo y la consulta en línea funciona perfecto.",
        foto:   "https://ui-avatars.com/api/?name=Ana+Ruiz&background=2ECC71&color=fff&rounded=true",
    },
]

const Testimonials = () => {

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
        })
    }, [])

    return (
        <section id="testimonios" className="testimonios">
            <div className="container">

                <div className="testimonios__header" data-aos="fade-up">
                    <p className="testimonios__label">TESTIMONIOS</p>
                    <h2 className="testimonios__titulo">
                        Lo que dicen nuestros pacientes
                    </h2>
                    <p className="testimonios__subtitulo">
                        Miles de personas ya confían en QuitoHampi para cuidar su salud
                        desde la comodidad de su hogar.
                    </p>
                </div>

                <div className="testimonios__grid">
                    {testimonios.map((t, index) => (
                        <article
                            key={index}
                            className="testimonio"
                            data-aos="fade-up"
                            data-aos-delay={index * 150}
                        >
                            <div className="testimonio__estrellas">★★★★★</div>
                            <p className="testimonio__texto">"{t.texto}"</p>
                            <div className="testimonio__autor">
                                <img
                                    src={t.foto}
                                    alt={t.nombre}
                                    className="testimonio__foto"
                                />
                                <div>
                                    <p className="testimonio__nombre">{t.nombre}</p>
                                    <p className="testimonio__lugar">{t.lugar}</p>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default Testimonials
