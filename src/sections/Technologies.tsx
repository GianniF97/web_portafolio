import React, { useMemo, useState } from 'react';
import {
  learningLogData,
  techCategories,
  technologiesData,
  type TechCategoryId,
} from '../data/portfolioData';
import { TechIcon } from '../components/Icons';

export const Technologies: React.FC = () => {
  const [activeLayer, setActiveLayer] = useState<'all' | TechCategoryId>('all');
  const [showLog, setShowLog] = useState<boolean>(false);

  const visibleCategories = useMemo(() => {
    if (activeLayer === 'all') return techCategories;
    return techCategories.filter((cat) => cat.id === activeLayer);
  }, [activeLayer]);

  return (
    <section id="tecnologias" className="sp-section sp-stack" aria-labelledby="stack-heading">
      <div className="sp-container">
        <div className="sp-section-row-head sp-reveal">
          <header>
            <p className="sp-eyebrow">Stack técnico y fundamentos</p>
            <h2 id="stack-heading" className="sp-section-title">
              Herramientas organizadas por capa de sistema
            </h2>
          </header>

          <button
            type="button"
            className={`sp-seg-btn ${showLog ? 'is-active' : ''}`}
            onClick={() => setShowLog((v) => !v)}
            aria-expanded={showLog}
          >
            {showLog ? 'Ver mapa del stack' : 'Ver bitácora técnica'}
          </button>
        </div>

        {!showLog ? (
          <>
            <div className="sp-filter-bar sp-reveal" role="group" aria-label="Filtrar por capa técnica">
              <button
                type="button"
                aria-pressed={activeLayer === 'all'}
                className={`sp-filter-btn ${activeLayer === 'all' ? 'is-active' : ''}`}
                onClick={() => setActiveLayer('all')}
              >
                Todas las capas
              </button>
              {techCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={activeLayer === cat.id}
                  className={`sp-filter-btn ${activeLayer === cat.id ? 'is-active' : ''}`}
                  onClick={() => setActiveLayer(cat.id)}
                >
                  {cat.title}
                </button>
              ))}
            </div>

            <div className="sp-stack-layers">
              {visibleCategories.map((cat) => {
                const items = technologiesData.filter((item) => item.category === cat.id);
                return (
                  <article key={cat.id} className="sp-glass-card sp-layer-card sp-reveal">
                    <div className="sp-layer-head">
                      <div>
                        <h3 className="sp-layer-title">{cat.title}</h3>
                        <p className="sp-layer-desc">{cat.description}</p>
                      </div>
                      <span className="sp-mono-count">
                        {items.length} {items.length === 1 ? 'tecnología' : 'tecnologías'}
                      </span>
                    </div>

                    <div className="sp-tech-list">
                      {items.map((tech) => (
                        <div key={tech.id} className="sp-tech-item">
                          <div className="sp-tech-item-top">
                            <span className="sp-tech-icon" aria-hidden="true">
                              <TechIcon iconKey={tech.iconKey} size={18} />
                            </span>
                            <div className="sp-tech-name-wrap">
                              <strong className="sp-tech-name">{tech.name}</strong>
                              <span
                                className={`sp-tech-stage ${
                                  tech.stage === 'En aprendizaje' ? 'is-learning' : 'is-active'
                                }`}
                              >
                                {tech.stage}
                              </span>
                            </div>
                          </div>
                          <p className="sp-tech-context">{tech.context}</p>
                        </div>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          </>
        ) : (
          <div className="sp-log-grid" aria-label="Notas técnicas de aprendizaje">
            {learningLogData.map((entry) => (
              <article key={entry.id} className="sp-glass-card sp-log-card sp-reveal" data-seen="true">
                <span className="sp-mono-caption">{entry.stageLabel}</span>
                <h3 className="sp-log-title">{entry.title}</h3>
                <p className="sp-body-copy">{entry.summary}</p>
                <p className="sp-log-takeaway">
                  <strong>Criterio:</strong> {entry.takeaway}
                </p>
                <div className="sp-tag-row">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="sp-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
