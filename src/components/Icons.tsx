import React from 'react';
import type { TechItem } from '../data/portfolioData';

interface IconProps {
  className?: string;
  size?: number;
}

export const TechIcon: React.FC<{ iconKey: TechItem['iconKey']; size?: number }> = ({
  iconKey,
  size = 20,
}) => {
  const commonProps = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    focusable: false,
  };

  switch (iconKey) {
    case 'python':
      return (
        <svg {...commonProps}>
          <path d="M12 2c-4 0-4 2-4 4v2h4v1H6c-2.5 0-4 1.5-4 4.5S3.5 18 6 18h2v-2.5c0-2 1.5-3.5 3.5-3.5h5c1.5 0 2.5-1 2.5-2.5V6c0-2 0-4-4-4h-3z" />
          <path d="M12 22c4 0 4-2 4-4v-2h-4v-1h6c2.5 0 4-1.5 4-4.5S20.5 6 18 6h-2v2.5c0 2-1.5 3.5-3.5 3.5h-5C6 12 5 13 5 14.5V18c0 2 0 4 4 4h3z" />
          <circle cx="9.5" cy="5.5" r="0.8" fill="currentColor" />
          <circle cx="14.5" cy="18.5" r="0.8" fill="currentColor" />
        </svg>
      );
    case 'typescript':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M8 11h5M10.5 11v7" />
          <path d="M18 12.5c-.6-.6-1.8-.8-2.6-.2-.8.6-.6 1.8.4 2.2l1.2.5c1 .4 1.2 1.6.4 2.2-.8.6-2 .4-2.6-.2" />
        </svg>
      );
    case 'javascript':
      return (
        <svg {...commonProps}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M11 10v6.5a1.5 1.5 0 0 1-3 0" />
          <path d="M17.5 12c-.5-.6-1.6-.8-2.3-.2-.7.5-.5 1.5.4 1.9l1.1.5c.9.4 1 1.4.3 2-.7.6-1.8.4-2.5-.2" />
        </svg>
      );
    case 'react':
      return (
        <svg {...commonProps}>
          <circle cx="12" cy="12" r="2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="10" ry="4.2" transform="rotate(120 12 12)" />
        </svg>
      );
    case 'html-css':
      return (
        <svg {...commonProps}>
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
          <line x1="14" y1="4" x2="10" y2="20" />
        </svg>
      );
    case 'tkinter':
      return (
        <svg {...commonProps}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <circle cx="6.5" cy="6.5" r="0.8" fill="currentColor" />
          <circle cx="9.5" cy="6.5" r="0.8" fill="currentColor" />
          <rect x="7" y="12.5" width="10" height="4" rx="1" />
        </svg>
      );
    case 'node':
      return (
        <svg {...commonProps}>
          <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
          <path d="M12 8v8M8.5 10L12 12l3.5-2" />
        </svg>
      );
    case 'sql':
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
        </svg>
      );
    case 'git':
      return (
        <svg {...commonProps}>
          <circle cx="6" cy="6" r="2.5" />
          <circle cx="18" cy="8" r="2.5" />
          <circle cx="6" cy="18" r="2.5" />
          <path d="M6 8.5v7M8.5 6h5a4.5 4.5 0 0 1 4.5 4.5v0" />
        </svg>
      );
    case 'vscode':
    case 'vite':
      return (
        <svg {...commonProps}>
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      );
    case 'flask':
      return (
        <svg {...commonProps}>
          <path d="M10 2v7.31a5 5 0 0 0-1.8 3.8A5 5 0 0 0 13 18a5 5 0 0 0 4.8-4.89 5 5 0 0 0-1.8-3.8V2h-6z" />
          <path d="M8.5 2h7M7 14h10" />
        </svg>
      );
    case 'php':
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="12" rx="10" ry="7" />
          <path d="M6 10v4M6 10h2a1.5 1.5 0 0 1 0 3H6" />
          <path d="M11 10v4M11 12h2a1 1 0 0 0 1-1v-1h-3" />
          <path d="M16 10v4M16 10h2a1.5 1.5 0 0 1 0 3h-2" />
        </svg>
      );
    case 'postgresql':
    case 'mysql':
    case 'database':
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="5" rx="8" ry="3" />
          <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
          <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
          <path d="M12 12v3M16 12l-4 4-4-4" />
        </svg>
      );
    case 'streamlit':
      return (
        <svg {...commonProps}>
          <polygon points="12 2 2 19 22 19" />
          <polygon points="12 7 6 17 18 17" />
        </svg>
      );
    case 'linux':
      return (
        <svg {...commonProps}>
          <ellipse cx="12" cy="10" rx="6" ry="7" />
          <circle cx="10" cy="8" r="1" fill="currentColor" />
          <circle cx="14" cy="8" r="1" fill="currentColor" />
          <path d="M10 11c1 1 3 1 4 0" />
          <path d="M6 19c2-2 4-1 6-1s4-1 6 1" />
          <path d="M5 14c-1 2 0 4 2 5M19 14c1 2 0 4-2 5" />
        </svg>
      );
    case 'security':
      return (
        <svg {...commonProps}>
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case 'vercel':
      return (
        <svg {...commonProps}>
          <polygon points="12 3 22 20 2 20" />
        </svg>
      );
    default:
      return (
        <svg {...commonProps}>
          <rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3 3" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      );
  }
};

export const ArrowUpRightIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export const GitHubIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const LinkedInIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export const MailIcon: React.FC<IconProps> = ({ size = 18, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const TerminalIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <polyline points="4 17 10 11 4 5" />
    <line x1="12" y1="19" x2="20" y2="19" />
  </svg>
);

export const DatabaseIcon: React.FC<IconProps> = ({ size = 16, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>
);

const strokeIcon = (size: number, className: string | undefined, children: React.ReactNode) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

export const ArrowDownRightIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <path d="M7 7l10 10" />
      <path d="M17 8v9H8" />
    </>
  ));

export const ArrowUpIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <path d="M12 19V5" />
      <path d="M6 11l6-6 6 6" />
    </>
  ));

export const PlusIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ));

export const SunIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </>
  ));

export const MoonIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  ));

export const LayersIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </>
  ));

export const CodeIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </>
  ));

export const ClockIcon: React.FC<IconProps> = ({ size = 15, className }) =>
  strokeIcon(size, className, (
    <>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 7 12 12 15 15" />
    </>
  ));

export const ChevronRightIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, <polyline points="9 18 15 12 9 6" />);

export const ShieldIcon: React.FC<IconProps> = ({ size = 16, className }) =>
  strokeIcon(size, className, (
    <>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ));

export const MenuIcon: React.FC<IconProps> = ({ size = 18, className }) =>
  strokeIcon(size, className, (
    <>
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </>
  ));

export const CloseIcon: React.FC<IconProps> = ({ size = 18, className }) =>
  strokeIcon(size, className, (
    <>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </>
  ));


