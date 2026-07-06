
import partner1 from "../../assets/partner1.png";
import partner2 from "../../assets/partner2.png";
import partner3 from "../../assets/partner3.png";
import partner4 from "../../assets/partner4.png";
import partner5 from "../../assets/partner5.png";

import "./Partners.css"

const Partners = () => {
  return (
    <section className="partners" id="partners">
      <div className="partners__container container">

        <div className="partners__header">
          <h2 className="partners__title">
            Instituciones que confían en Quito
            <span className="navbar__logo--primary">Care</span>
          </h2>

          <p className="partners__description">
            Trabajamos junto a clínicas, hospitales y centros médicos
            para ofrecer atención segura y confiable.
          </p>
        </div>

        <div className="partners__content">

          <article className="partners__card">
            <img
              src={partner1}
              alt="Hospital Metropolitano"
              className="partners__logo"
            />

            <h3 className="partners__name">
              Hospital Metropolitano
            </h3>
          </article>

          <article className="partners__card">
            <img
              src={partner2}
              alt="Clínica Vida"
              className="partners__logo"
            />

            <h3 className="partners__name">
              Clínica Vida
            </h3>
          </article>

          <article className="partners__card">
            <img
              src={partner3}
              alt="Hospital de los Valles"
              className="partners__logo"
            />

            <h3 className="partners__name">
              Hospital de los Valles
            </h3>
          </article>

          <article className="partners__card">
            <img
              src={partner4}
              alt="Clínica Integral"
              className="partners__logo"
            />

            <h3 className="partners__name">
              Clínica Integral
            </h3>
          </article>

          <article className="partners__card">
            <img
              src={partner5}
              alt="Hospital Militar"
              className="partners__logo"
            />

            <h3 className="partners__name">
              Hospital Militar
            </h3>
          </article>

        </div>

      </div>
    </section>
  );
};

export default Partners;