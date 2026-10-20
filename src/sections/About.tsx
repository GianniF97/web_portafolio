import React, { useState, useEffect, useRef, memo } from 'react';
import { personalProfile } from '../data/portfolioData';

/**
 * Sección "About Us" 
 * - Titular lateral izquierdo en monospace tracking-widest: "ABOUT ME".
 * - Párrafo principal a gran escala (text-[28px] md:text-[44px] lg:text-[60px]) con
 *   animación de revelación de color palabra por palabra al hacer scroll.
 * - Dos columnas de ítems con viñetas de puntos cuadrados en color de acento.
 */
export const About: React.FC = memo(() => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  const manifestoText =
    'Estudiante avanzado de Analista de Sistemas en Argentina. Diseño y construyo software de punta a punta: desde el modelado conceptual relacional hasta una interfaz limpia, tipada y accesible. Creo en sistemas que resuelven problemas reales con datos rigurosos y sin fricción operativa.';

  const words = manifestoText.split(' ');

  useEffect(() => {
    let rafId: number | null = null;

    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (!sectionRef.current) {
          rafId = null;
          return;
        }
        const rect = sectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        // Progreso relativo a la entrada y salida de la sección
        const start = windowHeight * 0.85;
        const end = windowHeight * 0.15;
        const total = start - end + rect.height;
        const current = start - rect.top;
        const progress = Math.min(1, Math.max(0, current / total));
        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      id="sobre-mi"
      ref={sectionRef}
      className="brikken-about-scrub-section"
      aria-labelledby="about-scrub-heading"
    >
      <div className="brikken-container">
        <div className="about-scrub-layout">
          {/* Columna Lateral Izquierda */}
          <div className="about-scrub-sidebar">
            <span id="about-scrub-heading" className="about-kicker-tag">
              SOBRE MÍ // ENFOQUE
            </span>
          </div>

          {/* Columna Principal Derecha */}
          <div className="about-scrub-main">
            {/* Párrafo con iluminación progresiva de cada palabra por scroll */}
            <p className="about-manifesto-paragraph" aria-label={manifestoText}>
              {words.map((word, idx) => {
                const wordActivationThreshold = idx / (words.length * 0.9);
                const isActivated = scrollProgress >= wordActivationThreshold;
                return (
                  <span
                    key={idx}
                    className={`scrub-word ${isActivated ? 'is-active' : ''}`}
                    style={{
                      color: isActivated
                        ? 'var(--text-primary)'
                        : 'rgba(105, 110, 100, 0.35)',
                      transition: 'color 0.18s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </p>

            {/* Dos Columnas de Pilares con Puntos Cuadrados Brikken */}
            <div className="about-bullets-dual-cols">
              <ul className="about-bullets-list">
                <li className="about-bullet-item">
                  <span className="bullet-square-icon" aria-hidden="true" />
                  <span className="bullet-item-text">
                    <strong>Modelado Relacional:</strong> Esquemas DER formalizados antes de codificar.
                  </span>
                </li>
                <li className="about-bullet-item">
                  <span className="bullet-square-icon" aria-hidden="true" />
                  <span className="bullet-item-text">
                    <strong>Backend en Flask:</strong> Arquitectura MVC limpia y cálculo volumétrico exacto.
                  </span>
                </li>
              </ul>

              <ul className="about-bullets-list">
                <li className="about-bullet-item">
                  <span className="bullet-square-icon" aria-hidden="true" />
                  <span className="bullet-item-text">
                    <strong>Frontend Tipado:</strong> Interfaces modernas con React y TypeScript.
                  </span>
                </li>
                <li className="about-bullet-item">
                  <span className="bullet-square-icon" aria-hidden="true" />
                  <span className="bullet-item-text">
                    <strong>Seguridad &amp; Calidad:</strong> Sanitización de entradas y código mantenible.
                  </span>
                </li>
              </ul>
            </div>

            {/* Cita de Ingeniería */}
            <div className="about-quote-stamp-strip">
              <p className="quote-stamp-text">
                “{personalProfile.about.quote}”
              </p>
              <span className="quote-stamp-author">
                — {personalProfile.name} · {personalProfile.about.education}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

About.displayName = 'About';

export default About;
