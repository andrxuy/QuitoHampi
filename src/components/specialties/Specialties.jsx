import "./Specialties.css"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

const especialidades = [
    { icon: "fa-stethoscope", title: "Medicina general",  description: "Atención integral para el cuidado de tu salud." },
    { icon: "fa-baby",        title: "Pediatría",         description: "Cuidado especializado para niños y adolescentes." },
    { icon: "fa-brain",       title: "Psicología",        description: "Apoyo emocional y salud mental para tu bienestar." },
    { icon: "fa-hand-dots",   title: "Dermatología",      description: "Diagnóstico y tratamiento para el cuidado de la piel." },
    { icon: "fa-heart-pulse", title: "Cardiología",       description: "Prevención, diagnóstico y tratamiento de enfermedades del corazón." },
    { icon: "fa-bone",        title: "Traumatología",     description: "Atención de lesiones óseas, articulares y musculares." },
]

const Specialties = () => {
    return (
        <section id="specialties" className="specialties">
            <div className="container">

                <h2 className="specialties__titulo">
                    Especialidades médicas
                </h2>

                <p className="specialties__subtitulo">
                    Contamos con profesionales en diversas áreas para cuidar tu salud.
                </p>

                <Swiper
                    modules={[Autoplay, Pagination]}
                    spaceBetween={24}
                    slidesPerView={1}
                    autoplay={{ delay: 2500, disableOnInteraction: false }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        768:  { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                    }}
                    style={{ paddingBottom: "3rem" }}
                >
                    {especialidades.map((esp, index) => (
                        <SwiperSlide key={index}>
                            <article className="specialty">
                                <div className="specialty__icon">
                                    <i className={`fa-solid ${esp.icon}`}></i>
                                </div>
                                <h3 className="specialty__title">
                                    {esp.title}
                                </h3>
                                <p className="specialty__description">
                                    {esp.description}
                                </p>
                            </article>
                        </SwiperSlide>
                    ))}
                </Swiper>

                <div className="specialties__boton-contenedor">
                    <a href="#" className="specialties__boton">
                        Ver todas las especialidades
                    </a>
                </div>

            </div>
        </section>
    )
}

export default Specialties
