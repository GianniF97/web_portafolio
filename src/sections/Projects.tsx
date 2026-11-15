import React, { useCallback, useMemo, useState } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';
import { projectsData, type ProjectStatus } from '../data/portfolioData';
import { ArrowUpRightIcon, GitHubIcon } from '../components/Icons';
import { ProjectLogo } from '../components/ProjectLogo';
import { ProjectWindowMockup } from '../components/ProjectWindowMockup';

type StatusFilter = 'Todos' | ProjectStatus;

const PROJ_HEAD_WORDS = ['Sistemas', 'y', 'experiencias'];

export const Projects: React.FC = () => {
  const { calmMode } = useDisplayMode();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Todos');

  const counts = useMemo<Record<StatusFilter, number>>(() => {
    const done = projectsData.filter((p) => p.status === 'Terminado').length;
    const wip = projectsData.filter((p) => p.status === 'En desarrollo').length;
    const experimental = projectsData.filter((p) => p.status === 'Experimental').length;
    return {
      Todos: projectsData.length,
      Terminado: done,
      'En desarrollo': wip,
      Experimental: experimental,
    };
  }, []);

  const visibleProjects = useMemo(() => {
    if (statusFilter === 'Todos') return projectsData;
    return projectsData.filter((project) => project.status === statusFilter);
  }, [statusFilter]);

  const handleWindowPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (calmMode || event.pointerType !== 'mouse') return;
      const el = event.currentTarget;
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      el.style.setProperty('--tilt-x', `${(-ny * 5).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${(nx * 6).toFixed(2)}deg`);
      el.style.setProperty('--spotlight-x', `${((nx + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty('--spotlight-y', `${((ny + 0.5) * 100).toFixed(1)}%`);
    },
    [calmMode]
  );

  const handleWindowPointerLeave = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const el = event.currentTarget;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }, []);

  return (
    <section
      id="proyectos"
      className="studio-section studio-projects-section"
      aria-labelledby="projects-heading"
    >
      <div className="studio-container">
        <header className="studio-section-header studio-projects-header">
          <div className="studio-section-kicker-wrap">
            <span className="studio-kicker-label">Proyectos Seleccionados · Archivo Técnico</span>
          </div>

          <div className="studio-projects-title-row">
            <div>
              <h2 id="projects-heading" className="studio-sv-title">
                {PROJ_HEAD_WORDS.map((word, idx) => (
                  <span
                    key={`${word}-${idx}`}
                    className="studio-sv-word"
                    style={{ '--w': idx } as React.CSSProperties}
                  >
                    <span>{word} </span>
                  </span>
                ))}
                <span className="studio-sv-word" style={{ '--w': 3 } as React.CSSProperties}>
                  <span className="studio-sv-wow">en producción.</span>
                </span>
              </h2>
              <p className="studio-section-lead">
                Cada pieza combina modelado estructural, lógica verificable e interfaz clara.
                Alterna entre vista, flujo arquitectónico, ficha técnica y adaptación móvil dentro de
                cada ventana.
              </p>
            </div>

            <div className="studio-filter-group" role="group" aria-label="Filtrar por estado">
              {(['Todos', 'Terminado', 'En desarrollo'] as StatusFilter[]).map((status) => {
                const isSelected = statusFilter === status;
                const count = counts[status] ?? 0;
                return (
                  <button
                    key={status}
                    type="button"
                    className={`studio-filter-btn ${isSelected ? 'is-active' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => setStatusFilter(status)}
                  >
                    <span>{status}</span>
                    <span className="studio-filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>
      </div>

      {/* Bandas asimétricas protagonistas .studio-pj / .studio-pj-flip */}
      <div className="studio-pj-stream">
        {visibleProjects.map((project, index) => {
          const isFlip = index % 2 === 1;
          return (
            <article
              key={project.id}
              id={`project-${project.id}`}
              className={`studio-pj ${isFlip ? 'studio-pj-flip' : ''}`}
              data-seen="true"
              onPointerMove={handleWindowPointerMove}
              onPointerLeave={handleWindowPointerLeave}
            >
              <div className="studio-pj-inner">
                <div className="studio-pj-text" data-at="0.06">
                  <div className="studio-pj-badges-row">
                    <span className="studio-pj-app">
                      <span className="studio-pj-icon">
                        <ProjectLogo projectId={project.id} size={22} />
                      </span>
                      <span>{project.title}</span>
                    </span>

                    <span
                      className={`studio-project-status ${
                        project.status === 'Terminado' ? 'is-done' : 'is-wip'
                      }`}
                    >
                      <span>{project.status}</span>
                    </span>
                  </div>

                  <p className="studio-pj-subtitle">{project.subtitle}</p>
                  <p className="studio-pj-line">{project.problem}</p>
                  <p className="studio-pj-kind">{project.category}</p>

                  <div className="studio-project-stack-wrap" aria-label="Tecnologías usadas">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="studio-stack-chip">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="studio-project-actions">
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="studio-pj-visit"
                      >
                        <span>Visitar sitio</span>
                        <ArrowUpRightIcon size={15} className="studio-rg-arrow" />
                      </a>
                    )}

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={
                          project.demoUrl ? 'studio-btn-glass' : 'studio-pj-visit studio-pj-repo'
                        }
                      >
                        <GitHubIcon size={15} />
                        <span>Código en GitHub</span>
                        <ArrowUpRightIcon size={14} className="studio-rg-arrow" />
                      </a>
                    )}
                  </div>
                </div>

                <div className="studio-pj-window-stage">
                  <ProjectWindowMockup project={project} />
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
