import React from 'react';
import { personalProfile } from '../data/portfolioData';

export const About: React.FC = () => {
  const { about } = personalProfile;

  return (
    <section id="sobre-mi" className="sp-section sp-about" aria-labelledby="about-heading">
      <div className="sp-container">
        <header className="sp-section-header sp-reveal">
          <p className="sp-eyebrow">Perfil profesional y criterio</p>
          <h2 id="about-heading" className="sp-section-title">
            Del modelo relacional a la experiencia en pantalla
          </h2>
        </header>

        <div className="sp-about-grid">
          <article className="sp-glass-card sp-about-quote-card sp-reveal">
            <blockquote className="sp-pull-quote">«{about.quote}»</blockquote>
            <p className="sp-body-copy">{about.introParagraph}</p>
            <p className="sp-body-copy">{about.whoIAm}</p>
            <p className="sp-body-copy">{about.whatILearn}</p>

            <dl className="sp-about-meta">
              <div>
                <dt>Formación</dt>
                <dd>{about.education}</dd>
              </div>
              <div>
                <dt>Metodología</dt>
                <dd>{about.howISolveProblems}</dd>
              </div>
            </dl>
          </article>

          <div className="sp-principles-grid" role="list" aria-label="Principios de trabajo">
            {about.workingPrinciples.map((principle) => (
              <article
                key={principle.title}
                role="listitem"
                className="sp-glass-card sp-principle-card sp-reveal"
              >
                <h3 className="sp-principle-title">{principle.title}</h3>
                <p className="sp-principle-desc">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
