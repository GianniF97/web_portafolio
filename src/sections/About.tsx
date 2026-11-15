import React, { useState } from 'react';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from '../components/GFLogo';

const ABOUT_TITLE_WORDS = ['De', 'la', 'estructura', 'de', 'datos', 'a', 'la'];

export const About: React.FC = () => {
  const [openIndices, setOpenIndices] = useState<number[]>([0]);

  const togglePrinciple = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  return (
    <section
      id="sobre-mi"
      className="studio-section studio-about-section studio-fq"
      aria-labelledby="about-heading"
    >
      <div className="studio-container">
        <div className="studio-fq-in">
          {/* Columna izquierda Sticky */}
          <header className="studio-fq-head">
            <div className="studio-section-kicker-wrap">
              <span className="studio-kicker-label">Sobre mí · Perfil Técnico</span>
            </div>

            <h2 id="about-heading" className="studio-fq-title">
              {ABOUT_TITLE_WORDS.map((word, wIdx) => (
                <span
                  key={`${word}-${wIdx}`}
                  className="studio-word-mask"
                  style={{ '--w': wIdx } as React.CSSProperties}
                >
                  <span>{word} </span>
                </span>
              ))}
              <span className="studio-word-mask" style={{ '--w': 7 } as React.CSSProperties}>
                <span className="studio-fq-fx">experiencia funcional.</span>
              </span>
            </h2>

            <div className="studio-about-role-bar">
              <span className="studio-badge-chrome">{personalProfile.hero.label}</span>
              <span className="studio-role-subtext">{personalProfile.about.education}</span>
            </div>

            <blockquote className="studio-quote-monolith">
              <div className="studio-quote-wm" aria-hidden="true">
                <GFLogo variant="watermark" />
              </div>
              <p className="studio-quote-text">“{personalProfile.about.quote}”</p>
              <footer className="studio-quote-caption">
                <span>{personalProfile.name}</span>
                <span aria-hidden="true">·</span>
                <span>{personalProfile.roleTag}</span>
              </footer>
            </blockquote>

            <div className="studio-focus-areas">
              <h3 className="studio-mini-heading">Foco de formación actual</h3>
              <ul className="studio-focus-list">
                {personalProfile.focusAreas.map((area) => (
                  <li key={area} className="studio-focus-pill">
                    <span className="studio-focus-marker" aria-hidden="true" />
                    <span>{area}</span>
                  </li>
                ))}
              </ul>
            </div>
          </header>

          {/* Columna derecha: Narrativa + Lista interactiva de principios estilo .fq-list */}
          <div className="studio-about-right">
            <div className="studio-about-prose">
              <p>{personalProfile.about.introParagraph}</p>
              <p>{personalProfile.about.whoIAm}</p>
              <p>{personalProfile.about.whatILearn}</p>
              <p>{personalProfile.about.howISolveProblems}</p>
              <p>{personalProfile.about.whatIImprove}</p>
            </div>

            <div className="studio-principles-section">
              <h3 className="studio-mini-heading">Criterios de construcción (explorar)</h3>
              <ul className="studio-fq-list">
                {personalProfile.about.workingPrinciples.map((principle, idx) => {
                  const isOpen = openIndices.includes(idx);
                  const panelId = `principle-panel-${idx}`;
                  return (
                    <li
                      key={principle.title}
                      className="studio-fq-item"
                      data-open={isOpen ? 'true' : undefined}
                      style={{ '--d': `${idx * 0.08}s` } as React.CSSProperties}
                    >
                      <h4 className="studio-fq-q">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-controls={panelId}
                          onClick={() => togglePrinciple(idx)}
                        >
                          <span className="studio-fq-q-text">{principle.title}</span>
                          <span className="studio-fq-plus" aria-hidden="true" />
                        </button>
                      </h4>

                      <div id={panelId} className="studio-fq-a">
                        <div>
                          <p>{principle.description}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
