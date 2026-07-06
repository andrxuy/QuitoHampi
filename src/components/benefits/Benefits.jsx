import computerImg from "../../assets/compu.png"
import personImg from "../../assets/persona.png"
import calendarImg from "../../assets/calendario.png"
import desktopImg from "../../assets/escritorio.png"
import mobileImg from "../../assets/celular.png"
import scheduleImg from "../../assets/agendar.png"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import "react-tabs/style/react-tabs.css"

import "./Benefits.css"

const Benefits = () => {
    return (

        <section id="benefits" className="benefits">
            <div className="container">

                <h2 className="benefits__titulo">¿Por qué elegir QuitoHampi?</h2>

                <Tabs className="benefits__tabs">

                    <TabList className="benefits__tablist">
                        <Tab className="benefits__tab">Para pacientes</Tab>
                        <Tab className="benefits__tab">Para gestión de citas</Tab>
                    </TabList>

                    <TabPanel>
                        <div className="benefits__grid">

                            <article className="benefit">
                                <img src={computerImg} alt="Videollamada Médica" loading="lazy"/>
                                <h3>Atención médica en casa</h3>
                                <p>Recibe atención médica por videollamada desde la comodidad de tu hogar.</p>
                            </article>

                            <article className="benefit">
                                <img src={desktopImg} alt="Consulta médica en línea" loading="lazy"/>
                                <h3>Consulta médica en línea</h3>
                                <p>Videollamadas seguras con profesionales de la salud desde tu hogar.</p>
                            </article>

                            <article className="benefit">
                                <img src={mobileImg} alt="Acceso desde tu móvil" loading="lazy"/>
                                <h3>Acceso desde tu móvil</h3>
                                <p>Conéctate con tu médico desde tu computadora o smartphone.</p>
                            </article>

                        </div>
                    </TabPanel>

                    <TabPanel>
                        <div className="benefits__grid">

                            <article className="benefit">
                                <img src={personImg} alt="Especialistas Verificados" loading="lazy"/>
                                <h3>Especialistas verificados</h3>
                                <p>Profesionales certificados y con amplia experiencia en distintas especialidades.</p>
                            </article>

                            <article className="benefit">
                                <img src={calendarImg} alt="Agenda de Citas Médicas" loading="lazy"/>
                                <h3>Agenda tu cita</h3>
                                <p>Elige el especialista, la fecha y la hora que mejor se adapten a ti.</p>
                            </article>

                            <article className="benefit">
                                <img src={scheduleImg} alt="Gestión rápida" loading="lazy"/>
                                <h3>Gestión rápida</h3>
                                <p>Agenda tu cita en pocos pasos y recibe recordatorios automáticos.</p>
                            </article>

                        </div>
                    </TabPanel>

                </Tabs>

            </div>
        </section>

    )
}

export default Benefits
