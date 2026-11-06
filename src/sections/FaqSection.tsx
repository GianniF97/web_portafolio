import React, { useState, memo } from 'react';

interface FaqItem {
  id: string;
  question: string;
  leadAnswer: string;
  detailAnswer: string;
}

const faqItems: FaqItem[] = [
  {
    id: 'perfil',
    question: '¿Sos desarrollador backend, analista de sistemas o frontend?',
    leadAnswer: 'Los tres, cuando el proyecto necesita consistencia de punta a punta.',
    detailAnswer:
      'Mi formación principal es como Analista de Sistemas: me enfoco en entender el dominio, diseñar el modelo de datos relacional y construir el backend en Python/Flask. Al mismo tiempo, construyo las interfaces con React y TypeScript para que la experiencia sea intuitiva y sin fricción.',
  },
  {
    id: 'modelo-datos',
    question: '¿Por qué priorizás el modelado de datos antes de programar?',
    leadAnswer: 'Porque un error en el esquema relacional cuesta diez veces más resolverlo en el código.',
    detailAnswer:
      'Diseñar el Diagrama Entidad-Relación (DER), normalizar tablas y definir restricciones de clave foránea previene inconsistencias lógicas antes de escribir la primera ruta o pantalla. Mis sistemas industriales y financieros se apoyan en esta base sólida.',
  },
  {
    id: 'produccion',
    question: '¿Tenés proyectos que se puedan probar en vivo actualmente?',
    leadAnswer: 'Sí, tanto en producción como con código abierto documentado.',
    detailAnswer:
      'Sí, cuento con plataformas en producción como la estación de radio online Radio Gravity (radiogravity.web.app) y el sitio web institucional de Biofuego (biofuego.web.app). Asimismo, el Sistema de Gestión de Aserradero y proyectos analíticos cuentan con repositorios abiertos en GitHub con documentación técnica formal y diagramas de arquitectura.',
  },
  {
    id: 'disponibilidad',
    question: '¿Cuál es tu disponibilidad actual para pasantías o trabajo remoto?',
    leadAnswer: 'Disponible para pasantías técnicas, desarrollo de software y colaboraciones.',
    detailAnswer:
      'Resido en Argentina (GMT-3) y cuento con disponibilidad para trabajar de forma remota o híbrida, aportando compromiso, rigor técnico y entusiasmo por integrarme a equipos profesionales.',
  },
];

export const FaqSection: React.FC = memo(() => {
  const [openId, setOpenId] = useState<string | null>('perfil');

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="brikken-faq-section" aria-labelledby="faq-main-heading">
      <div className="brikken-container">
        <div className="faq-inner-container">
          <div className="faq-header-block">
            <div className="section-eyebrow-row">
              <span aria-hidden="true">[</span>
              <span>05 // PREGUNTAS CLAVE &amp; CRITERIO</span>
              <span aria-hidden="true">]</span>
            </div>

            <h2 id="faq-main-heading" className="faq-display-title">
              Preguntas antes de colaborar.
            </h2>
            <p className="faq-lead-desc">
              Criterios y respuestas concretas sobre mi formación, forma de trabajo y enfoque de desarrollo.
            </p>
          </div>

          <ul className="faq-accordion-list" aria-label="Preguntas frecuentes sobre Gianni Ferrari">
            {faqItems.map((item) => {
              const isOpen = openId === item.id;
              return (
                <li key={item.id} className="faq-accordion-item">
                  <button
                    type="button"
                    className="faq-accordion-trigger"
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <h3 className="faq-question-text">{item.question}</h3>
                    <div className={`faq-icon-cross ${isOpen ? 'is-open' : ''}`} aria-hidden="true">
                      <span className="cross-line horizontal" />
                      <span className="cross-line vertical" />
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${item.id}`}
                    className={`faq-answer-collapse ${isOpen ? 'is-open' : ''}`}
                    hidden={!isOpen}
                  >
                    <div className="faq-answer-content">
                      <p className="faq-answer-p">
                        <strong className="answer-lead">{item.leadAnswer} </strong>
                        <span className="answer-detail">{item.detailAnswer}</span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
});

FaqSection.displayName = 'FaqSection';

export default FaqSection;
