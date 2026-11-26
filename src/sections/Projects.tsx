import React, { useMemo, useState } from 'react';
import { projectsData, type ProjectItem } from '../data/portfolioData';
import { useDisplayMode } from '../context/DisplayModeContext';
import { ArrowUpRightIcon, GitHubIcon, PlusIcon } from '../components/Icons';

type ProjectFilter = 'all' | 'live' | 'backend';

interface ProjectCardProps {
  project: ProjectItem;
  calmMode: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, calmMode }) => {
  const [expanded, setExpanded] = useState(false);

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (calmMode || e.pointerType !== 'mouse') return;
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / Math.max(rect.width, 1);
    const ry = (e.clientY - rect.top) / Math.max(rect.height, 1);
    const rotY = (rx - 0.5) * 6.5;
    const rotX = (0.5 - ry) * 6.5;
    card.style.setProperty('--tilt-rx', `${rotX.toFixed(2)}deg`);
    card.style.setProperty('--tilt-ry', `${rotY.toFixed(2)}deg`);
    card.style.setProperty('--sheen-x', `${(rx * 100).toFixed(1)}%`);
    card.style.setProperty('--sheen-y', `${(ry * 100).toFixed(1)}%`);
  };

  const resetPointer = (e: React.PointerEvent<HTMLElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--tilt-rx', '0deg');
    card.style.setProperty('--tilt-ry', '0deg');
  };

  const hasDemo = Boolean(project.demoUrl);
  const hasRepo = Boolean(project.repoUrl);

  return (
    <article
      className="sp-project-card"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="sp-project-media">
        <img
          src={project.image.src}
          alt={project.image.alt}
          width={project.image.width}
          height={project.image.height}
          loading="lazy"
          decoding="async"
        />
        <span className="sp-project-status">{project.status}</span>
      </div>

      <div className="sp-project-body">
        <span className="sp-mono-caption">{project.category}</span>
        <h3 className="sp-project-title">{project.title}</h3>
        <p className="sp-project-subtitle">{project.subtitle}</p>
        <p className="sp-project-desc">{project.problem}</p>

        <div className="sp-tag-row">
          {project.technologies.slice(0, 4).map((tech) => (
            <span key={tech} className="sp-tag">
              {tech}
            </span>
          ))}
        </div>

        {expanded && (
          <div className="sp-project-details">
            <p className="sp-project-goal">{project.goal}</p>
            <ul className="sp-project-highlights">
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="sp-project-footer">
          <button
            type="button"
            className="sp-project-more-btn"
            onClick={() => setExpanded((prev) => !prev)}
            aria-expanded={expanded}
          >
            <PlusIcon size={14} className={expanded ? 'is-rotated' : undefined} />
            <span>{expanded ? 'Ocultar detalles' : 'Decisiones técnicas'}</span>
          </button>

          <div className="sp-project-links">
            {hasDemo && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sp-project-link is-primary"
              >
                <span>Ver web</span>
                <ArrowUpRightIcon size={13} />
              </a>
            )}
            {hasRepo && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sp-project-link"
              >
                <GitHubIcon size={14} />
                <span>Código</span>
                <ArrowUpRightIcon size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const Projects: React.FC = () => {
  const { calmMode } = useDisplayMode();
  const [filter, setFilter] = useState<ProjectFilter>('all');

  const filteredProjects = useMemo(() => {
    if (filter === 'live') {
      return projectsData.filter((p) => Boolean(p.demoUrl));
    }
    if (filter === 'backend') {
      return projectsData.filter((p) =>
        p.technologies.some(
          (t) =>
            t.includes('Python') ||
            t.includes('Flask') ||
            t.includes('SQL') ||
            t.includes('Git')
        )
      );
    }
    return projectsData;
  }, [filter]);

  return (
    <section id="proyectos" className="sp-section sp-projects" aria-labelledby="projects-heading">
      <div className="sp-container">
        <div className="sp-section-row-head sp-reveal">
          <header>
            <p className="sp-eyebrow">Proyectos reales en producción y repositorio</p>
            <h2 id="projects-heading" className="sp-section-title">
              Sistemas de gestión, aplicaciones web y algoritmos
            </h2>
          </header>

          <div className="sp-filter-bar" role="group" aria-label="Filtrar proyectos">
            <button
              type="button"
              aria-pressed={filter === 'all'}
              className={`sp-filter-btn ${filter === 'all' ? 'is-active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todos ({projectsData.length})
            </button>
            <button
              type="button"
              aria-pressed={filter === 'live'}
              className={`sp-filter-btn ${filter === 'live' ? 'is-active' : ''}`}
              onClick={() => setFilter('live')}
            >
              En producción
            </button>
            <button
              type="button"
              aria-pressed={filter === 'backend'}
              className={`sp-filter-btn ${filter === 'backend' ? 'is-active' : ''}`}
              onClick={() => setFilter('backend')}
            >
              Python · SQL · Ingeniería
            </button>
          </div>
        </div>

        <div className="sp-projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} calmMode={calmMode} />
          ))}
        </div>
      </div>
    </section>
  );
};
