import React from 'react';

interface ProjectLogoProps {
  projectId: string;
  size?: number;
}

/**
 * Isotipo monocromático minimalista único para cada proyecto del portafolio.
 */
export const ProjectLogo: React.FC<ProjectLogoProps> = ({ projectId, size = 30 }) => {
  const svgProps = {
    width: size,
    height: size,
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (projectId) {
    case 'sistema-aserradero':
      return (
        <svg {...svgProps}>
          <circle cx="16" cy="16" r="11" />
          <circle cx="16" cy="16" r="6" />
          <line x1="5" y1="16" x2="27" y2="16" />
          <circle cx="16" cy="16" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'biofuego':
      return (
        <svg {...svgProps}>
          <path d="M16 4c2.8 4.2 6.5 6.8 6.5 12a6.5 6.5 0 1 1-13 0c0-3.2 1.8-6 3.5-8.2.4 2 1.6 3.2 2.8 3.2-.3-2.5.1-4.8.2-7z" />
          <path d="M13 21.5c0-1.8 1.3-3.2 3-4.5 1.7 1.3 3 2.7 3 4.5a3 3 0 1 1-6 0z" />
        </svg>
      );

    case 'radiogravity':
      return (
        <svg {...svgProps}>
          <circle cx="16" cy="16" r="2.5" fill="currentColor" />
          <path d="M10.5 10.5a7.8 7.8 0 0 0 0 11" />
          <path d="M21.5 10.5a7.8 7.8 0 0 1 0 11" />
          <path d="M7 7a12.7 12.7 0 0 0 0 18" />
          <path d="M25 7a12.7 12.7 0 0 1 0 18" />
        </svg>
      );

    case 'programacion-cientifica-lab':
      return (
        <svg {...svgProps}>
          <line x1="5" y1="26" x2="27" y2="26" />
          <line x1="6" y1="5" x2="6" y2="27" />
          <path d="M6 23c4-1 6-14 10-14s6 12 10 9" />
          <circle cx="16" cy="9" r="1.5" fill="currentColor" />
        </svg>
      );

    case 'sistema-gestion-cheques-core':
      return (
        <svg {...svgProps}>
          <rect x="4" y="8" width="24" height="16" rx="2" />
          <line x1="8" y1="14" x2="18" y2="14" />
          <line x1="8" y1="19" x2="14" y2="19" />
          <path d="M20 18l2 2 3.5-4" />
        </svg>
      );

    case 'practicas-git-github-pp':
    default:
      return (
        <svg {...svgProps}>
          <circle cx="9" cy="8" r="2.5" />
          <circle cx="9" cy="24" r="2.5" />
          <circle cx="23" cy="14" r="2.5" />
          <line x1="9" y1="10.5" x2="9" y2="21.5" />
          <path d="M9 19c0-4 14-1 14-2.5" />
        </svg>
      );
  }
};
