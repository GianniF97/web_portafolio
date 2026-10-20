import React, { useState, useMemo, memo } from 'react';
import { projectsData, type ProjectStatus } from '../data/portfolioData';
import { ArrowUpRightIcon, GitHubIcon } from '../components/Icons';

type FilterOption = 'Todos' | ProjectStatus;

/**
 * Sección de Proyectos de Brikken+Co ("Our Work"):
 * - Titular gigante a escala monumental (text-[64px] md:text-[140px] xl:text-[220px]).
 * - Grilla asimétrica escalonada de 2 columnas donde la segunda tarjeta está desplazada hacia abajo (md:mt-24).
 * - Tercera tarjeta a todo el ancho inferior.
 * - Tarjetas técnicas compactas al pie.
 */
export const Projects: React.FC = memo(() => {
  const [selectedStatus, setSelectedStatus] = useState<FilterOption>('Todos');

  const filterOptions: Array<{ label: FilterOption; count: number }> = useMemo(() => {
    const doneCount = projectsData.filter((p) => p.status === 'Terminado').length;
    const devCount = projectsData.filter((p) => p.status === 'En desarrollo').length;
    return [
      { label: 'Todos', count: projectsData.length },
      { label: 'Terminado', count: doneCount },
      { label: 'En desarrollo', count: devCount },
    ];
  }, []);

  const filteredProjects = useMemo(() => {
    return projectsData.filter((project) => {
      if (selectedStatus === 'Todos') return true;
      return project.status === selectedStatus;
    });
  }, [selectedStatus]);

  const flagship = filteredProjects.find((p) => p.id === 'sistema-aserradero');
  const cheques = filteredProjects.find((p) => p.id === 'sistema-cheques-2');
  const fotos = filteredProjects.find((p) => p.id === 'sistema-fotos-vercel');
  const archiveProjects = filteredProjects.filter(
    (p) => p.id === 'programacion-cientifica' || p.id === 'git-practicas-profesionales'
  );

  return (
    <section id="proyectos" className="brikken-work-section reveal-section" aria-labelledby="work-title">
      <div className="brikken-container">
        {/* Cabecera Brikken con Titular Monumental Gigante */}
        <div className="brikken-work-header">
          <div className="section-eyebrow-row">
            <span aria-hidden="true">[</span>
            <span>02 // PROYECTOS SELECCIONADOS</span>
            <span aria-hidden="true">]</span>
          </div>

          <h2 id="work-title" className="brikken-monumental-work-title">
            Proyectos
          </h2>

          {/* Filtros Limpios con Contadores */}
          <div className="brikken-filter-bar" role="group" aria-label="Filtrar proyectos por estado">
            {filterOptions.map((opt) => {
              const isSelected = selectedStatus === opt.label;
              return (
                <button
                  key={opt.label}
                  type="button"
                  className={`filter-pill-btn ${isSelected ? 'is-active' : ''}`}
                  onClick={() => setSelectedStatus(opt.label)}
                  aria-pressed={isSelected}
                >
                  <span>{opt.label}</span>
                  <span className="filter-badge-num tabular-nums">({opt.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Grilla Asimétrica Escalonada Brikken */}
        <div className="brikken-staggered-work-grid">
          {/* ARTÍCULO 1 (Columna Izquierda): SISTEMA DE ASERRADERO */}
          {flagship && (
            <article className="brikken-work-article article-left reveal-card" aria-label={`Proyecto: ${flagship.title}`}>
              <div className="work-card-media-box">
                <img
                  src={flagship.image.src}
                  alt={flagship.image.alt}
                  width={flagship.image.width}
                  height={flagship.image.height}
                  loading="lazy"
                  className="work-media-img"
                />
                <span className="work-media-badge">FLASK (MVC) · MODELADO DER · CUBICACIÓN M³</span>
              </div>

              <div className="work-card-details">
                <div className="work-card-meta-line">
                  <span className="work-cat-tag">{flagship.category}</span>
                  <span className="work-status-tag">{flagship.status}</span>
                </div>

                <h3 className="work-item-headline">{flagship.title}</h3>
                <p className="work-item-lead">{flagship.subtitle}</p>
                <p className="work-item-desc">{flagship.problem}</p>

                <div className="work-item-chips">
                  {flagship.technologies.map((t) => (
                    <span key={t} className="brikken-tech-chip">{t}</span>
                  ))}
                </div>

                <div className="work-item-actions">
                  {flagship.repoUrl && (
                    <a
                      href={flagship.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brikken-pill-btn-primary"
                    >
                      <GitHubIcon size={14} />
                      <span>Ver Repositorio</span>
                      <ArrowUpRightIcon size={12} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          )}

          {/* ARTÍCULO 2 (Columna Derecha Desplazada hacia abajo - md:mt-24): CHEQUES 2.0 */}
          {cheques && (
            <article className="brikken-work-article article-right-offset reveal-card" aria-label={`Proyecto: ${cheques.title}`}>
              <div className="work-card-media-box">
                <img
                  src={cheques.image.src}
                  alt={cheques.image.alt}
                  width={cheques.image.width}
                  height={cheques.image.height}
                  loading="lazy"
                  className="work-media-img"
                />
                <span className="work-media-badge">FINANZAS · VERCEL · SEMÁFORO DE ALERTAS</span>
              </div>

              <div className="work-card-details">
                <div className="work-card-meta-line">
                  <span className="work-cat-tag">{cheques.category}</span>
                  <span className="work-status-tag">{cheques.status}</span>
                </div>

                <h3 className="work-item-headline">{cheques.title}</h3>
                <p className="work-item-lead">{cheques.subtitle}</p>
                <p className="work-item-desc">{cheques.problem}</p>

                <div className="work-item-chips">
                  {cheques.technologies.map((t) => (
                    <span key={t} className="brikken-tech-chip">{t}</span>
                  ))}
                </div>

                <div className="work-item-actions">
                  {cheques.repoUrl && (
                    <a
                      href={cheques.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brikken-pill-btn-primary"
                    >
                      <GitHubIcon size={14} />
                      <span>Ver Repositorio</span>
                      <ArrowUpRightIcon size={12} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          )}

          {/* ARTÍCULO 3 (Ancho Completo Inferior): FOTOS VERCEL */}
          {fotos && (
            <article className="brikken-work-article article-full-width reveal-card" aria-label={`Proyecto: ${fotos.title}`}>
              <div className="work-full-grid">
                <div className="work-card-media-box">
                  <img
                    src={fotos.image.src}
                    alt={fotos.image.alt}
                    width={fotos.image.width}
                    height={fotos.image.height}
                    loading="lazy"
                    className="work-media-img"
                  />
                  <span className="work-media-badge">PRODUCCIÓN · VERCEL CLOUD · NEXT.JS / REACT</span>
                </div>

                <div className="work-card-details">
                  <div className="work-card-meta-line">
                    <span className="work-cat-tag">{fotos.category}</span>
                    <span className="work-status-tag">{fotos.status}</span>
                  </div>

                  <h3 className="work-item-headline">{fotos.title}</h3>
                  <p className="work-item-lead">{fotos.subtitle}</p>
                  <p className="work-item-desc">{fotos.problem}</p>

                  <div className="work-item-chips">
                    {fotos.technologies.map((t) => (
                      <span key={t} className="brikken-tech-chip">{t}</span>
                    ))}
                  </div>

                  <div className="work-item-actions">
                    {fotos.demoUrl && (
                      <a
                        href={fotos.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brikken-pill-btn-primary"
                      >
                        <span>Demo en Producción</span>
                        <ArrowUpRightIcon size={12} />
                      </a>
                    )}
                    {fotos.repoUrl && (
                      <a
                        href={fotos.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brikken-pill-btn-secondary"
                      >
                        <GitHubIcon size={14} />
                        <span>Repositorio</span>
                        <ArrowUpRightIcon size={12} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* FILA DE PROYECTOS TÉCNICOS ADICIONALES */}
          {archiveProjects.length > 0 && (
            <div className="brikken-archive-ledger-row">
              {archiveProjects.map((p) => (
                <div key={p.id} className="archive-ledger-card reveal-card">
                  <div className="work-card-meta-line">
                    <span className="work-cat-tag">{p.category}</span>
                    <span className="work-status-tag">{p.status}</span>
                  </div>
                  <h4 className="archive-card-title">{p.title}</h4>
                  <p className="archive-card-desc">{p.goal}</p>
                  <div className="work-item-chips">
                    {p.technologies.map((t) => (
                      <span key={t} className="brikken-tech-chip">{t}</span>
                    ))}
                  </div>
                  {p.repoUrl && (
                    <a
                      href={p.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="archive-link"
                    >
                      <GitHubIcon size={13} />
                      <span>Ver código en GitHub</span>
                      <ArrowUpRightIcon size={11} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
