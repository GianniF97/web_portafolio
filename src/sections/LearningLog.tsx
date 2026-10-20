import React, { memo } from 'react';
import { learningLogData } from '../data/portfolioData';

export const LearningLog: React.FC = memo(() => {
  if (!learningLogData || learningLogData.length === 0) {
    return null;
  }

  return (
    <section id="aprendizaje" className="brikken-section reveal-section" aria-labelledby="learning-heading">
      <div className="brikken-container">
        {/* Cabecera Brikken */}
        <div className="section-header-block">
          <div className="section-eyebrow-row">
            <span aria-hidden="true">[</span>
            <span>04 // BITÁCORA TÉCNICA &amp; APRENDIZAJE</span>
            <span aria-hidden="true">]</span>
          </div>

          <h2 id="learning-heading" className="section-display-title">
            Decisiones de arquitectura &amp; evolución.
          </h2>

          <p className="section-lead-description">
            Registro de desafíos reales y conclusiones técnicas al modelar bases de datos relacionales, desplegar plataformas en la nube y estructurar software modular.
          </p>
        </div>

        {/* Ledger / Cuaderno de Ingeniería Brikken */}
        <div className="journal-entries-stack">
          {learningLogData.map((entry, idx) => (
            <article key={entry.id} className="journal-entry-card reveal-card">
              <div className="journal-sidebar-meta">
                <span className="journal-idx-badge tabular-nums">0{idx + 1} // LOG</span>
                <span className="journal-category-pill">{entry.category}</span>
                <span className="tech-stage-tag">{entry.stageLabel}</span>
              </div>

              <div className="journal-content-panel">
                <h3 className="journal-entry-title">{entry.title}</h3>
                <p className="journal-entry-summary">{entry.summary}</p>

                <div className="journal-takeaway-box">
                  <span className="takeaway-label">Conclusión de Ingeniería</span>
                  <p className="takeaway-text">“{entry.takeaway}”</p>
                </div>

                <div className="tech-chips-strip" aria-label="Tecnologías asociadas">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="brikken-tech-chip">{tag}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
});
LearningLog.displayName = 'LearningLog';

export default LearningLog;
