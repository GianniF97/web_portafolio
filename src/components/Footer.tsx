import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';
import { useCookieConsent } from '../context/CookieConsentContext';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from './GFLogo';
import {
  ArrowUpIcon,
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from './Icons';

function getArgentinaClock(): string {
  try {
    return new Intl.DateTimeFormat('es-AR', {
      timeZone: personalProfile.timeZone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date());
  } catch {
    return '--:--';
  }
}

export const Footer: React.FC = () => {
  const { calmMode } = useDisplayMode();
  const { currentPath, navigateTo, openConfig } = useCookieConsent();
  const currentYear = new Date().getFullYear();
  const [localTime, setLocalTime] = useState<string>(() => getArgentinaClock());
  const [copiedMail, setCopiedMail] = useState<boolean>(false);
  const stripRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLocalTime(getArgentinaClock());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(personalProfile.contact.email);
      setCopiedMail(true);
    } catch {
      setCopiedMail(true);
    }
    window.setTimeout(() => setCopiedMail(false), 2200);
  };

  const handleStripPointer = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (calmMode || event.pointerType !== 'mouse') return;
      const el = stripRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / Math.max(rect.width, 1);
      el.style.setProperty('--ft-sheen-x', `${(nx * 100).toFixed(1)}%`);
    },
    [calmMode]
  );

  return (
    <footer className="studio-ft" aria-label="Pie de página">
      <div className="studio-container">
        <div className="studio-ft-head">
          <div className="studio-ft-lead">
            <GFLogo variant="footer" showSubtitle={true} size={46} />

            <p className="studio-ft-say">
              Software con <strong>estructura y movimiento.</strong>
            </p>

            <ul className="studio-ft-reach">
              <li>
                <span>{personalProfile.hero.label} · Disponible</span>
              </li>
              <li>
                <span>
                  {personalProfile.location} · <b>{localTime}</b> ({personalProfile.timeZoneLabel})
                </span>
              </li>
              <li>
                <button
                  type="button"
                  className="studio-ft-mail"
                  onClick={handleCopy}
                  title="Copiar correo electrónico"
                >
                  <MailIcon size={14} />
                  <span>{personalProfile.contact.email}</span>
                  <span
                    className="studio-ft-copied"
                    data-on={copiedMail ? 'true' : undefined}
                  >
                    Copiado
                  </span>
                </button>
              </li>
            </ul>
          </div>

          <div className="studio-ft-cols">
            <nav className="studio-ft-nav" aria-label="Enlaces del sitio">
              <span className="studio-footer-heading">Recorrido</span>
              {(['#inicio', '#sobre-mi', '#tecnologias', '#proyectos', '#contacto'] as const).map(
                (hash) => {
                  const labels: Record<string, string> = {
                    '#inicio': 'Inicio',
                    '#sobre-mi': 'Sobre mí',
                    '#tecnologias': 'Tecnologías',
                    '#proyectos': 'Proyectos',
                    '#contacto': 'Contacto',
                  };
                  return (
                    <a
                      key={hash}
                      href={hash}
                      onClick={(e) => {
                        if (currentPath !== '/') {
                          e.preventDefault();
                          navigateTo('/', hash);
                        }
                      }}
                    >
                      {labels[hash]}
                    </a>
                  );
                }
              )}
            </nav>

            <div className="studio-ft-nav">
              <span className="studio-footer-heading">Presencia</span>
              <a
                href={personalProfile.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-footer-ext-link"
              >
                <GitHubIcon size={14} />
                <span>GitHub</span>
                <ArrowUpRightIcon size={12} />
              </a>
              <a
                href={personalProfile.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-footer-ext-link"
              >
                <LinkedInIcon size={14} />
                <span>LinkedIn</span>
                <ArrowUpRightIcon size={12} />
              </a>
              <a
                href="https://biofuego.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-footer-ext-link"
              >
                <span>Biofuego</span>
                <ArrowUpRightIcon size={12} />
              </a>
              <a
                href="https://radiogravity.web.app"
                target="_blank"
                rel="noopener noreferrer"
                className="studio-footer-ext-link"
              >
                <span>Radio Gravity</span>
                <ArrowUpRightIcon size={12} />
              </a>
            </div>

            <nav className="studio-ft-nav studio-footer-legal" aria-label="Documentación legal y privacidad">
              <span className="studio-footer-heading">Legal</span>
              <a
                href="/privacidad"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/privacidad');
                }}
                aria-current={currentPath === '/privacidad' ? 'page' : undefined}
              >
                Política de Privacidad
              </a>
              <a
                href="/cookies"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo('/cookies');
                }}
                aria-current={currentPath === '/cookies' ? 'page' : undefined}
              >
                Política de Cookies
              </a>
              <button
                type="button"
                className="studio-footer-cookie-btn"
                onClick={openConfig}
              >
                Configurar cookies
              </button>
            </nav>
          </div>
        </div>

        {/* Franja cromada monumental GF interactiva */}
        <div
          ref={stripRef}
          className="studio-footer-monogram-strip"
          onPointerMove={handleStripPointer}
          aria-hidden="true"
        >
          <span className="studio-footer-gf-big">GF · GIANNI FERRARI</span>
          <span className="studio-footer-divider-line" />
        </div>

        <div className="studio-ft-row">
          <p className="studio-footer-copy">
            © {currentYear} {personalProfile.name} · Desarrollador en formación · Hecho en Argentina
          </p>
          <a
            href="#inicio"
            className="studio-back-top"
            onClick={(e) => {
              if (currentPath !== '/') {
                e.preventDefault();
                navigateTo('/');
              }
            }}
          >
            <span>Volver arriba</span>
            <ArrowUpIcon size={14} />
          </a>
        </div>
      </div>
    </footer>
  );
};
