import React, { memo, useId } from 'react';

interface GFLogoProps {
  className?: string;
  size?: number;
  showSubtitle?: boolean;
  variant?: 'navbar' | 'hero' | 'footer' | 'watermark';
}

/**
 * Identidad visual tecnológica GF:
 * - navbar / hero / footer / watermark: monograma octogonal biselado en cromo e iridiscencia.
 */
export const GFLogo: React.FC<GFLogoProps> = memo(
  ({ className = '', size = 38, showSubtitle = true, variant = 'navbar' }) => {
    const uid = useId().replace(/:/g, '');
    const chromeGradId = `gf-chrome-${uid}`;
    const iridescentGradId = `gf-irid-${uid}`;
    const frameGradId = `gf-frame-${uid}`;

    const svgContent = (
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="studio-gf-svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={chromeGradId} x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="32%" stopColor="#CBD5E1" />
            <stop offset="56%" stopColor="#64748B" />
            <stop offset="78%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          <linearGradient id={iridescentGradId} x1="8" y1="54" x2="56" y2="10" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#67E8F9" />
            <stop offset="50%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#C4B5FD" />
          </linearGradient>

          <linearGradient id={frameGradId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="rgba(255,255,255,0.22)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.04)" />
            <stop offset="100%" stopColor="rgba(103,232,249,0.2)" />
          </linearGradient>
        </defs>

        <path
          d="M12 4H52L60 12V52L52 60H12L4 52V12L12 4Z"
          fill="rgba(10, 12, 18, 0.85)"
          stroke={`url(#${frameGradId})`}
          strokeWidth="1.5"
        />

        <path d="M15 9H49" stroke="rgba(255,255,255,0.16)" strokeWidth="0.9" />
        <path d="M15 55H49" stroke="rgba(103,232,249,0.22)" strokeWidth="0.9" />

        <path
          d="M31 18H19L15 22V42L19 46H29L33 42V32H24"
          stroke={`url(#${chromeGradId})`}
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        <path
          d="M38 46V18H50M38 31H47.5"
          stroke={`url(#${iridescentGradId})`}
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        <polygon points="33,24 35.5,26.5 33,29 30.5,26.5" fill="#FFFFFF" />
      </svg>
    );

    if (variant === 'watermark') {
      return (
        <div className={`studio-gf-watermark ${className}`} aria-hidden="true">
          {svgContent}
        </div>
      );
    }

    if (variant === 'hero') {
      return (
        <div className={`studio-gf-hero-emblem ${className}`} style={{ width: size, height: size }}>
          {svgContent}
        </div>
      );
    }

    return (
      <div className={`studio-gf-brand variant-${variant} ${className}`}>
        <div className="studio-gf-icon" style={{ width: size, height: size }}>
          {svgContent}
        </div>

        {showSubtitle && (
          <div className="studio-gf-text">
            <span className="studio-gf-name">GIANNI FERRARI</span>
            <span className="studio-gf-role">DESARROLLADOR EN FORMACIÓN</span>
          </div>
        )}
      </div>
    );
  }
);

GFLogo.displayName = 'GFLogo';

export default GFLogo;
