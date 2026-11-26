import React, { Suspense, lazy, useState } from 'react';
import { personalProfile } from '../data/portfolioData';
import { useDisplayMode } from '../context/DisplayModeContext';
import { ArrowDownRightIcon, ArrowUpRightIcon, GitHubIcon, LinkedInIcon } from '../components/Icons';

const SpatialScene3D = lazy(() =>
  import('../components/SpatialScene3D').then((m) => ({ default: m.SpatialScene3D }))
);

export const Hero: React.FC = () => {
  const { calmMode } = useDisplayMode();
  const [pulsedCount, setPulsedCount] = useState(0);

  const triggerPulse = () => {
    window.dispatchEvent(new CustomEvent('gf-sculpture-pulse'));
    setPulsedCount((c) => c + 1);
  };

  const setHoverState = (active: boolean) => {
    window.dispatchEvent(new CustomEvent('gf-sculpture-hover', { detail: { active } }));
  };

  return (
    <section id="inicio" className="sp-section sp-hero" aria-label="Presentación principal">
      <Suspense fallback={null}>
        <SpatialScene3D />
      </Suspense>

      <div className="sp-container sp-hero-grid">
        <div className="sp-hero-copy sp-reveal" data-seen="true">
          <p className="sp-eyebrow">
            {personalProfile.roleTag} · {personalProfile.location} ({personalProfile.timeZoneLabel})
          </p>

          <h1 className="sp-hero-title">
            <span>{personalProfile.name}</span>
            <strong className="sp-hero-claim">
              Sistemas pensados desde los datos hasta la interfaz.
            </strong>
          </h1>

          <p className="sp-hero-lead">{personalProfile.hero.lead}</p>

          <div className="sp-hero-actions">
            <a href="#proyectos" className="sp-btn-primary">
              <span>{personalProfile.hero.primaryCtaText}</span>
              <ArrowDownRightIcon size={16} />
            </a>
            <a href="#contacto" className="sp-btn-ghost">
              <span>{personalProfile.hero.secondaryCtaText}</span>
            </a>
          </div>

          <div className="sp-hero-links" aria-label="Enlaces externos">
            <a
              href={personalProfile.contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-inline-ext"
            >
              <GitHubIcon size={15} />
              <span>{personalProfile.githubHandle}</span>
              <ArrowUpRightIcon size={13} />
            </a>
            <a
              href={personalProfile.contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-inline-ext"
            >
              <LinkedInIcon size={15} />
              <span>LinkedIn</span>
              <ArrowUpRightIcon size={13} />
            </a>
            <span className="sp-hero-availability">{personalProfile.availabilityText}</span>
          </div>
        </div>

        {/* Ventana espacial interactiva sobre el Monolito 3D GF dentro del Hero */}
        <div className="sp-hero-stage-col">
          <button
            type="button"
            id="hero-sculpture-trigger"
            className="sp-sculpture-window"
            onClick={triggerPulse}
            onPointerEnter={() => setHoverState(true)}
            onPointerLeave={() => setHoverState(false)}
            aria-label="Interactuar con escultura 3D GF: impulsar expansión modular"
          >
            <span className="sp-window-corner is-tl" aria-hidden="true" />
            <span className="sp-window-corner is-tr" aria-hidden="true" />
            <span className="sp-window-corner is-bl" aria-hidden="true" />
            <span className="sp-window-corner is-br" aria-hidden="true" />

            <div className="sp-window-hud">
              <span className="sp-mono-caption">ESCULTURA WEBGL · MONOLITO GF</span>
              <span className="sp-mono-hint">
                {calmMode
                  ? 'Vista estática accesible'
                  : pulsedCount > 0
                    ? 'Impulso aplicado · Clic para repetir'
                    : 'Mover cursor o hacer clic para pulsar'}
              </span>
            </div>
          </button>
        </div>
      </div>

      <a href="#sobre-mi" className="sp-scroll-cue" aria-label="Desplazar hacia Sobre mí">
        <span className="sp-scroll-line" aria-hidden="true" />
        <span>Desplazar · Explorar portafolio</span>
      </a>
    </section>
  );
};
