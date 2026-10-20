import React, { useState, useMemo, memo } from 'react';
import {
  techCategories,
  technologiesData,
  type LearningStage,
} from '../data/portfolioData';
import { TechIcon } from '../components/Icons';

type StageFilter = 'Todas' | LearningStage;

export const Technologies: React.FC = memo(() => {
  const [stageFilter, setStageFilter] = useState<StageFilter>('Todas');

  const stageCounts = useMemo(() => {
    const active = technologiesData.filter((t) => t.stage === 'Práctica activa').length;
    const learning = technologiesData.filter((t) => t.stage === 'En aprendizaje').length;
    return {
      Todas: technologiesData.length,
      'Práctica activa': active,
      'En aprendizaje': learning,
    };
  }, []);

  const filterButtons: StageFilter[] = ['Todas', 'Práctica activa', 'En aprendizaje'];

  return (
    <section id="tecnologias" className="brikken-section reveal-section" aria-labelledby="tech-heading">
      <div className="brikken-container">
        {/* Cabecera Brikken */}
        <div className="section-header-block">
          <div className="section-eyebrow-row">
            <span aria-hidden="true">[</span>
            <span>03 // STACK &amp; CAPABILITIES</span>
            <span aria-hidden="true">]</span>
          </div>

          <h2 id="tech-heading" className="section-display-title">
            Capacidades técnicas &amp; herramientas.
          </h2>

          <p className="section-lead-description">
            Organizadas por dominio de arquitectura. En lugar de barras de porcentaje vacías, cada herramienta detalla el contexto real de cómo la aplico o estudio en mis proyectos.
          </p>

          {/* Filtros Limpios */}
          <div className="brikken-filter-bar" role="group" aria-label="Filtrar tecnologías por etapa">
            {filterButtons.map((stage) => {
              const isSelected = stageFilter === stage;
              return (
                <button
                  key={stage}
                  type="button"
                  className={`filter-pill-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setStageFilter(stage)}
                  aria-pressed={isSelected}
                >
                  <span>{stage}</span>
                  <span className="filter-badge-num tabular-nums">({stageCounts[stage]})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grupos por Dominio de Arquitectura */}
        <div className="tech-domains-stack">
          {techCategories.map((cat) => {
            const items = technologiesData.filter(
              (item) =>
                item.category === cat.id &&
                (stageFilter === 'Todas' || item.stage === stageFilter)
            );

            if (items.length === 0) return null;

            return (
              <div key={cat.id} className="tech-domain-block reveal-card">
                <div className="domain-header-row">
                  <div className="domain-title-wrap">
                    <span className="domain-code-badge">{cat.codeLabel}</span>
                    <h3 className="domain-title-text">{cat.title}</h3>
                  </div>
                  <span className="domain-desc-text">{cat.description}</span>
                </div>

                <div className="domain-items-grid">
                  {items.map((tech) => (
                    <div key={tech.id} className="tech-item-card">
                      <div className="tech-item-top">
                        <div className="tech-item-id">
                          <span className="tech-icon-holder" aria-hidden="true">
                            <TechIcon iconKey={tech.iconKey} size={18} />
                          </span>
                          <span className="tech-item-name">{tech.name}</span>
                        </div>
                        <span className="tech-stage-tag">{tech.stage}</span>
                      </div>
                      <p className="tech-item-context">{tech.context}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
Technologies.displayName = 'Technologies';

export default Technologies;
