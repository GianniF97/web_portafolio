import React, { useState, useEffect, useRef, memo } from 'react';

/**
 * Sección interactiva "Services / Capabilities" de Brikken+Co:
 * - Contenedor con altura de scroll (300vh en desktop).
 * - Pantalla fija ("sticky top-0 h-screen") con fondo oscuro forestal (#252923).
 * - Palabras monumentales centrales: BACKEND / DATOS / INTERFAZ.
 * - Tarjetas técnicas que se deslizan progresivamente desde los laterales conforme avanza el scroll.
 * - En móvil colapsa en un bloque limpio de alto impacto.
 */
export const ServicesSticky: React.FC = memo(() => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (!containerRef.current) {
          rafId = null;
          return;
        }
        const rect = containerRef.current.getBoundingClientRect();
        const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
        if (totalHeight <= 0) {
          rafId = null;
          return;
        }
        const currentY = -rect.top;
        const progress = Math.min(1, Math.max(0, currentY / totalHeight));
        setScrollProgress(progress);
        rafId = null;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Progresión de aparición de las 3 tarjetas
  // Tarjeta 1: activa entre 0.1 y 0.45
  const card1Progress = Math.min(1, Math.max(0, (scrollProgress - 0.08) / 0.25));
  // Tarjeta 2: activa entre 0.38 y 0.72
  const card2Progress = Math.min(1, Math.max(0, (scrollProgress - 0.36) / 0.25));
  // Tarjeta 3: activa entre 0.68 y 1.0
  const card3Progress = Math.min(1, Math.max(0, (scrollProgress - 0.65) / 0.25));

  return (
    <section id="capacidades" ref={containerRef} className="brikken-services-sticky-section">
      {/* ===================================================================
          1. VERSIÓN DESKTOP: STICKY 300vh CON ANIMACIÓN DE SCROLL
          =================================================================== */}
      <div className="services-desktop-track">
        <div className="services-sticky-viewport">
          {/* Grilla hairline de fondo */}
          <div className="services-grid-overlay" aria-hidden="true">
            <div className="services-grid-line" />
            <div className="services-grid-line" />
            <div className="services-grid-line" />
            <div className="services-grid-line" />
          </div>

          {/* Bloque Tipográfico Central Monumental */}
          <div className="services-center-display">
            <div className="services-stack-words">
              <span className="service-big-word">BACKEND</span>
              <span className="service-big-word">DATOS</span>
              <span className="service-big-word">INTERFAZ</span>
            </div>
            <div className="services-sync-kicker">
              <span>CADA COMPONENTE ESENCIAL. CADA PARTE EN SINTONÍA.</span>
            </div>
          </div>

          {/* Tarjeta 1: Desliza desde la derecha */}
          <div
            className="services-floating-card card-right"
            style={{
              opacity: card1Progress,
              transform: `translateY(${(1 - card1Progress) * 60}px) scale(${0.92 + card1Progress * 0.08})`,
              pointerEvents: card1Progress > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="floating-card-head">
              <span className="card-kicker-tag">01 // INTEGRIDAD</span>
              <span className="card-dot" aria-hidden="true" />
            </div>
            <h3 className="floating-card-title">Modelado Relacional (DER)</h3>
            <p className="floating-card-desc">
              Diseño formal de esquemas relacionales normalizados antes de escribir la primera línea de código. Garantía de integridad referencial y prevención de anomalías transaccionales.
            </p>
          </div>

          {/* Tarjeta 2: Desliza desde la izquierda */}
          <div
            className="services-floating-card card-left"
            style={{
              opacity: card2Progress,
              transform: `translateY(${(1 - card2Progress) * 60}px) scale(${0.92 + card2Progress * 0.08})`,
              pointerEvents: card2Progress > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="floating-card-head">
              <span className="card-kicker-tag">02 // LÓGICA MVC</span>
              <span className="card-dot" aria-hidden="true" />
            </div>
            <h3 className="floating-card-title">Backend Robusto en Flask</h3>
            <p className="floating-card-desc">
              Implementación de arquitectura MVC en Python. Algoritmos de cálculo volumétrico exacto (m³) para aserraderos y control transaccional de datos con persistencia relacional.
            </p>
          </div>

          {/* Tarjeta 3: Desliza desde la derecha inferior */}
          <div
            className="services-floating-card card-right-bottom"
            style={{
              opacity: card3Progress,
              transform: `translateY(${(1 - card3Progress) * 60}px) scale(${0.92 + card3Progress * 0.08})`,
              pointerEvents: card3Progress > 0.5 ? 'auto' : 'none',
            }}
          >
            <div className="floating-card-head">
              <span className="card-kicker-tag">03 // EXPERIENCIA</span>
              <span className="card-dot" aria-hidden="true" />
            </div>
            <h3 className="floating-card-title">Interfaces Tipadas con React &amp; TS</h3>
            <p className="floating-card-desc">
              Desarrollo de interfaces conectadas a contratos de datos estrictos. Accesibilidad nativa WCAG 2.2 AA, validaciones preventivas en cliente y servidor, y cero fricción operativa.
            </p>
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. VERSIÓN MÓVIL: STACK LIMPIO DE ALTO IMPACTO
          =================================================================== */}
      <div className="services-mobile-stack">
        <div className="services-mobile-header">
          <div className="services-stack-words">
            <span className="service-big-word">BACKEND</span>
            <span className="service-big-word">DATOS</span>
            <span className="service-big-word">INTERFAZ</span>
          </div>
          <p className="services-mobile-sub">Cada componente esencial. Cada parte en sintonía.</p>
        </div>

        <div className="services-mobile-cards-list">
          <div className="services-mobile-card">
            <span className="card-kicker-tag">01 // INTEGRIDAD</span>
            <h3 className="floating-card-title">Modelado Relacional (DER)</h3>
            <p className="floating-card-desc">
              Diseño formal de esquemas relacionales normalizados antes de escribir código. Integridad referencial garantizada.
            </p>
          </div>

          <div className="services-mobile-card">
            <span className="card-kicker-tag">02 // LÓGICA MVC</span>
            <h3 className="floating-card-title">Backend Robusto en Flask</h3>
            <p className="floating-card-desc">
              Arquitectura MVC limpia en Python, APIs estructuradas y algoritmos matemáticos exactos.
            </p>
          </div>

          <div className="services-mobile-card">
            <span className="card-kicker-tag">03 // EXPERIENCIA</span>
            <h3 className="floating-card-title">Interfaces Tipadas con React &amp; TS</h3>
            <p className="floating-card-desc">
              Desarrollo frontend riguroso con TypeScript, interfaces accesibles y rendimiento garantizado.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
});

ServicesSticky.displayName = 'ServicesSticky';

export default ServicesSticky;
