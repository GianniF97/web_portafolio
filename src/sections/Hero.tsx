import React, { useCallback, useEffect, useRef } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';
import { personalProfile } from '../data/portfolioData';
import { ChromeScene3D } from '../components/ChromeScene3D';
import { GFLogo } from '../components/GFLogo';
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
} from '../components/Icons';

export const Hero: React.FC = () => {
  const { calmMode, liteMode } = useDisplayMode();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const storyRef = useRef<HTMLDivElement | null>(null);
  const dimsRef = useRef<HTMLSpanElement | null>(null);

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (calmMode || liteMode || event.pointerType !== 'mouse') return;
      const el = rootRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      const ny = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;

      el.style.setProperty('--hero-mx', `${(nx * 100).toFixed(2)}%`);
      el.style.setProperty('--hero-my', `${(ny * 100).toFixed(2)}%`);
      el.style.setProperty('--hero-rx', `${(-ny * 8).toFixed(2)}deg`);
      el.style.setProperty('--hero-ry', `${(nx * 10).toFixed(2)}deg`);
    },
    [calmMode, liteMode]
  );

  const handlePointerLeave = useCallback(() => {
    const el = rootRef.current;
    if (!el) return;
    el.style.setProperty('--hero-rx', '0deg');
    el.style.setProperty('--hero-ry', '0deg');
  }, []);

  // Controlador ligero de métricas en vivo del marco vectorial dentro de .studio-story
  useEffect(() => {
    const storyEl = storyRef.current;
    if (!storyEl) return;

    if (calmMode) {
      storyEl.style.setProperty('--story-p', '1');
      if (dimsRef.current) dimsRef.current.textContent = '100% × OK';
      return;
    }

    const updateProgress = () => {
      const rect = storyEl.getBoundingClientRect();
      const scrollable = Math.max(storyEl.offsetHeight - window.innerHeight, 1);
      const raw = Math.min(Math.max(-rect.top / scrollable, 0), 1);
      storyEl.style.setProperty('--story-p', raw.toFixed(4));

      // Fase marco vectorial (0.0 -> 0.42)
      const frameP = Math.min(Math.max(raw / 0.42, 0), 1);
      storyEl.style.setProperty('--frame-p', frameP.toFixed(4));

      // Fase escritura con caret (0.28 -> 0.65)
      const writeP = Math.min(Math.max((raw - 0.25) / 0.35, 0), 1);
      storyEl.style.setProperty('--write-p', writeP.toFixed(4));

      // Fase extrusión 3D cromo (0.5 -> 0.92)
      const chromeP = Math.min(Math.max((raw - 0.48) / 0.42, 0), 1);
      storyEl.style.setProperty('--chrome-p', chromeP.toFixed(4));

      // Cortina de bloques de salida (0.82 -> 1.0)
      const outroP = Math.min(Math.max((raw - 0.8) / 0.2, 0), 1);
      storyEl.style.setProperty('--outro-p', outroP.toFixed(4));

      if (dimsRef.current) {
        const wPx = Math.round(frameP * 420);
        const hPx = Math.round(frameP * 92);
        dimsRef.current.textContent = `${wPx} × ${hPx}`;
      }
    };

    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, [calmMode]);

  return (
    <div
      id="inicio"
      ref={rootRef}
      className="studio-hero-wrapper"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {/* PARTE A: Primer impacto negro puro 100svh con monograma triple GF + escena 3D */}
      <section className="studio-hero-stage" aria-labelledby="hero-main-heading">
        <div className="studio-hero-grid-bg" aria-hidden="true" />
        <div className="studio-hero-spotlight" aria-hidden="true" />

        {/* Escena 3D WebGL de profundidad ambiental detrás del monolito */}
        <div className="studio-hero-webgl-layer" aria-hidden="true">
          <ChromeScene3D className="studio-hero-3d-canvas" />
        </div>

        <div className="studio-hero-centerpiece">
          <p className="studio-hero-eyebrow">
            <span>{personalProfile.hero.label}</span>
            <span className="studio-hero-sep" aria-hidden="true">
              ·
            </span>
            <span>{personalProfile.about.education}</span>
          </p>

          {/* Monograma escultórico 3D GF */}
          <div className="studio-mark-stage">
            <GFLogo variant="monolith" />
          </div>

          <div className="studio-hero-caption-block">
            <h1 id="hero-main-heading" className="studio-hero-name-heading">
              <span className="studio-chrome-word" data-text="GIANNI FERRARI">
                GIANNI FERRARI
              </span>
            </h1>

            <p className="studio-hero-concise-line">
              Modelado de datos, desarrollo backend e interfaces web construidas con rigor.
            </p>

            <div className="studio-hero-actions">
              <a href="#proyectos" className="studio-btn-chrome">
                <span>Explorar proyectos</span>
                <ArrowDownRightIcon size={16} />
              </a>

              <a href="#contacto" className="studio-btn-glass">
                <span>Contactar</span>
                <ArrowUpRightIcon size={16} />
              </a>
            </div>

            <div className="studio-hero-quick-links">
              <a
                href={personalProfile.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-meta-link"
              >
                <GitHubIcon size={14} />
                <span>{personalProfile.githubHandle}</span>
                <ArrowUpRightIcon size={12} />
              </a>

              <a
                href={personalProfile.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-meta-link"
              >
                <LinkedInIcon size={14} />
                <span>LinkedIn</span>
                <ArrowUpRightIcon size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Indicador de desplazamiento estilo wowww.art (.hint) */}
        <a href="#manifiesto-gf" className="studio-scroll-hint" aria-label="Desplazar hacia abajo">
          <span>Scroll</span>
          <span className="studio-hint-line" aria-hidden="true" />
        </a>
      </section>

      {/* PARTE B: Escenario Pinned Scroll-Scrubbed (.story) */}
      <section
        id="manifiesto-gf"
        ref={storyRef}
        className="studio-story"
        aria-label="Manifiesto interactivo de desarrollo"
      >
        <div className="studio-story-stage">
          <div className="studio-sentence" data-ready="true">
            <span className="studio-sentence-line">
              <span className="studio-word">soy un </span>
              <span className="studio-frame-wrap">
                <span className="studio-frame-word">desarrollador</span>
                <span className="studio-frame-box" aria-hidden="true">
                  <span className="studio-frame-handle handle-tl" />
                  <span className="studio-frame-handle handle-tr" />
                  <span className="studio-frame-handle handle-bl" />
                  <span className="studio-frame-handle handle-br" />
                  <span ref={dimsRef} className="studio-frame-dims">
                    0 × 0
                  </span>
                  <svg
                    viewBox="0 0 22 26"
                    className="studio-frame-cursor"
                    aria-hidden="true"
                  >
                    <path
                      d="M1 1L7 23L11 15L20 12L1 1Z"
                      fill="#050507"
                      stroke="#FFFFFF"
                      strokeWidth="1.6"
                    />
                  </svg>
                </span>
              </span>
              <span className="studio-word"> en formación</span>
            </span>

            <span className="studio-sentence-line">
              <span className="studio-typewriter-wrap">
                <span className="studio-typewriter-text">construyendo</span>
                <span className="studio-caret" aria-hidden="true" />
              </span>
              <span className="studio-word"> </span>
              <span className="studio-mosaic-word">sistemas</span>
              <span className="studio-word"> reales</span>
            </span>

            <span className="studio-sentence-line">
              <span className="studio-word">con datos, lógica y </span>
              <span className="studio-chrome-extrude" data-text="SELLO GF">
                SELLO GF
              </span>
            </span>
          </div>

          {/* Cortina de bloques geométricos de transición al salir del manifiesto */}
          <div className="studio-story-outro" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div
                key={idx}
                className="studio-outro-bar"
                style={{ '--bar-i': idx } as React.CSSProperties}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
