import React, { useState, useMemo, memo } from 'react';
import { projectsData, type ProjectStatus, type ProjectItem } from '../data/portfolioData';
import { ArrowUpRightIcon, GitHubIcon } from '../components/Icons';

type FilterOption = 'Todos' | ProjectStatus;

/**
 * Sección de Proyectos ("Our Work"):
 * - Titular gigante a escala monumental.
 * - Grilla asimétrica escalonada de 2 columnas donde la segunda tarjeta está desplazada hacia abajo (md:mt-24).
 * - Tercera tarjeta a todo el ancho inferior.
 * - Tarjetas técnicas compactas al pie para proyectos de laboratorio e investigación.
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

  const isTopThree = (p: ProjectItem) =>
    p.id === 'sistema-aserradero' || p.id === 'biofuego' || p.id === 'radiogravity';

  const flagship = filteredProjects.find((p) => p.id === 'sistema-aserradero');
  const biofuego = filteredProjects.find((p) => p.id === 'biofuego');
  const radiogravity = filteredProjects.find((p) => p.id === 'radiogravity');
  const archiveProjects = filteredProjects.filter((p) => !isTopThree(p));
  const hasTopThree = Boolean(flagship || biofuego || radiogravity);

  return (
    <section id="proyectos" className="brikken-work-section reveal-section" aria-labelledby="work-title">
      <div className="brikken-container">
        {/* Cabecera Brikken con Titular Monumental */}
        <div className="brikken-work-header">
          <div className="section-eyebrow-row">
            <span aria-hidden="true">[</span>
            <span>02 // PROYECTOS SELECCIONADOS</span>
            <span aria-hidden="true">]</span>
          </div>

          <h2 id="work-title" className="brikken-monumental-work-title">
            Proyectos
          </h2>

          {/* Filtros con Contadores */}
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
                  decoding="async"
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

          {/* ARTÍCULO 2 (Columna Derecha Desplazada hacia abajo - md:mt-24): BIOFUEGO */}
          {biofuego && (
            <article className="brikken-work-article article-right-offset reveal-card" aria-label={`Proyecto: ${biofuego.title}`}>
              <div className="work-card-media-box">
                <img
                  src={biofuego.image.src}
                  alt={biofuego.image.alt}
                  width={biofuego.image.width}
                  height={biofuego.image.height}
                  loading="lazy"
                  decoding="async"
                  className="work-media-img"
                />
                <span className="work-media-badge">PRODUCCIÓN · FIREBASE · WEB INSTITUCIONAL</span>
              </div>

              <div className="work-card-details">
                <div className="work-card-meta-line">
                  <span className="work-cat-tag">{biofuego.category}</span>
                  <span className="work-status-tag">{biofuego.status}</span>
                </div>

                <h3 className="work-item-headline">{biofuego.title}</h3>
                <p className="work-item-lead">{biofuego.subtitle}</p>
                <p className="work-item-desc">{biofuego.problem}</p>

                <div className="work-item-chips">
                  {biofuego.technologies.map((t) => (
                    <span key={t} className="brikken-tech-chip">{t}</span>
                  ))}
                </div>

                <div className="work-item-actions">
                  {biofuego.demoUrl && (
                    <a
                      href={biofuego.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brikken-pill-btn-primary"
                    >
                      <span>Visitar Sitio Web</span>
                      <ArrowUpRightIcon size={12} />
                    </a>
                  )}
                  {biofuego.repoUrl && (
                    <a
                      href={biofuego.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="brikken-pill-btn-secondary"
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

          {/* ARTÍCULO 3 (Ancho Completo Inferior): RADIO GRAVITY */}
          {radiogravity && (
            <article className="brikken-work-article article-full-width reveal-card" aria-label={`Proyecto: ${radiogravity.title}`}>
              <div className="work-full-grid">
                <div className="work-card-media-box">
                  <img
                    src={radiogravity.image.src}
                    alt={radiogravity.image.alt}
                    width={radiogravity.image.width}
                    height={radiogravity.image.height}
                    loading="lazy"
                    decoding="async"
                    className="work-media-img"
                  />
                  <span className="work-media-badge">STREAMING EN VIVO · PWA · THREE.JS &amp; WEBGL</span>
                </div>

                <div className="work-card-details">
                  <div className="work-card-meta-line">
                    <span className="work-cat-tag">{radiogravity.category}</span>
                    <span className="work-status-tag">{radiogravity.status}</span>
                  </div>

                  <h3 className="work-item-headline">{radiogravity.title}</h3>
                  <p className="work-item-lead">{radiogravity.subtitle}</p>
                  <p className="work-item-desc">{radiogravity.problem}</p>

                  <div className="work-item-chips">
                    {radiogravity.technologies.map((t) => (
                      <span key={t} className="brikken-tech-chip">{t}</span>
                    ))}
                  </div>

                  <div className="work-item-actions">
                    {radiogravity.demoUrl && (
                      <a
                        href={radiogravity.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brikken-pill-btn-primary"
                      >
                        <span>Escuchar Radio en Vivo</span>
                        <ArrowUpRightIcon size={12} />
                      </a>
                    )}
                    {radiogravity.repoUrl && (
                      <a
                        href={radiogravity.repoUrl}
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
            <div className={`brikken-archive-ledger-row ${!hasTopThree ? 'is-standalone-grid' : ''}`}>
              {archiveProjects.map((p) => (
                <div key={p.id} className="archive-ledger-card reveal-card">
                  <div className="work-card-meta-line">
                    <span className="work-cat-tag">{p.category}</span>
                    <span className="work-status-tag">{p.status}</span>
                  </div>
                  <h4 className="archive-card-title">{p.title}</h4>
                  <p className="archive-card-desc">{p.problem || p.goal}</p>
                  <div className="work-item-chips">
                    {p.technologies.map((t) => (
                      <span key={t} className="brikken-tech-chip">{t}</span>
                    ))}
                  </div>
                  <div className="archive-card-actions">
                    {p.demoUrl && (
                      <a
                        href={p.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="archive-link"
                      >
                        <span>Visitar demo</span>
                        <ArrowUpRightIcon size={11} />
                      </a>
                    )}
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
                </div>
              ))}
            </div>
          )}

          {/* ESTADO VACÍO CUANDO NO HAY COINCIDENCIAS */}
          {filteredProjects.length === 0 && (
            <div className="brikken-empty-projects-state">
              <p>No se encontraron proyectos en este estado.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

Projects.displayName = 'Projects';

export default Projects;
