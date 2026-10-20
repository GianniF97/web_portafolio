import React, { memo } from 'react';

interface GFLogoProps {
  className?: string;
  size?: number;
  showSubtitle?: boolean;
}

/**
 * Monograma profesional GF para Gianni Ferrari
 * Inspirado en la estética tipográfica y arquitectónica de Brikken+Co.
 * Geometría minimalista, trazos precisos, proporciones equilibradas.
 */
export const GFLogo: React.FC<GFLogoProps> = memo(({
  className = '',
  size = 36,
  showSubtitle = true,
}) => {
  return (
    <a
      href="#inicio"
      className={`gf-brand-identity ${className}`}
      aria-label="Gianni Ferrari — Ir al inicio"
    >
      {/* Monograma SVG Vectorial GF */}
      <div className="gf-monogram-emblem" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="gf-monogram-svg"
          aria-hidden="true"
        >
          {/* Fondo sutil cuadrado con bordes de precisión */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="4"
            fill="var(--bg-secondary)"
            stroke="var(--border)"
            strokeWidth="1.5"
          />

          {/* Letra G: trazado geométrico contemporáneo */}
          <path
            d="M 22 14
               H 14
               A 4 4 0 0 0 10 18
               V 30
               A 4 4 0 0 0 14 34
               H 20
               A 4 4 0 0 0 24 30
               V 24
               H 18"
            stroke="var(--text-primary)"
            strokeWidth="2.75"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Letra F: trazado geométrico en paralelo */}
          <path
            d="M 29 34
               V 14
               H 40
               M 29 23
               H 38"
            stroke="var(--accent-dark)"
            strokeWidth="2.75"
            strokeLinecap="square"
            strokeLinejoin="miter"
          />

          {/* Punto de anclaje de precisión arquitectónica */}
          <rect
            x="22.5"
            y="22.5"
            width="3"
            height="3"
            fill="var(--accent)"
          />
        </svg>
      </div>

      {showSubtitle && (
        <div className="gf-brand-typography">
          <span className="gf-brand-name">GIANNI FERRARI</span>
          <span className="gf-brand-descriptor">ANALISTA &amp; SOFTWARE DEV</span>
        </div>
      )}
    </a>
  );
});

GFLogo.displayName = 'GFLogo';

export default GFLogo;
