import React, { useEffect, useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from './GFLogo';
import { ArrowUpIcon, ArrowUpRightIcon, GitHubIcon, LinkedInIcon } from './Icons';

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
  const { currentPath, navigateTo, openConfig } = useCookieConsent();
  const [localTime, setLocalTime] = useState<string>(() => getArgentinaClock());
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(getArgentinaClock()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="sp-footer" aria-label="Pie de página">
      <div className="sp-container">
        <div className="sp-footer-grid">
          <div className="sp-footer-brand">
            <GFLogo variant="footer" showSubtitle={true} size={40} />
            <p className="sp-footer-tagline">
              {personalProfile.roleTag} · {personalProfile.location} · {localTime} ({personalProfile.timeZoneLabel})
            </p>
          </div>

          <nav className="sp-footer-col" aria-label="Navegación del sitio">
            <span className="sp-footer-heading">Recorrido</span>
            {(['#inicio', '#sobre-mi', '#tecnologias', '#proyectos', '#contacto'] as const).map(
              (hash) => {
                const labels: Record<string, string> = {
                  '#inicio': 'Inicio',
                  '#sobre-mi': 'Sobre mí',
                  '#tecnologias': 'Stack técnico',
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

          <div className="sp-footer-col">
            <span className="sp-footer-heading">Presencia</span>
            <a
              href={personalProfile.contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-inline-ext"
            >
              <GitHubIcon size={14} />
              <span>GitHub</span>
              <ArrowUpRightIcon size={12} />
            </a>
            <a
              href={personalProfile.contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="sp-inline-ext"
            >
              <LinkedInIcon size={14} />
              <span>LinkedIn</span>
              <ArrowUpRightIcon size={12} />
            </a>
            <a href="https://biofuego.web.app" target="_blank" rel="noopener noreferrer" className="sp-inline-ext">
              <span>Biofuego</span>
              <ArrowUpRightIcon size={12} />
            </a>
            <a href="https://radiogravity.web.app" target="_blank" rel="noopener noreferrer" className="sp-inline-ext">
              <span>Radio Gravity</span>
              <ArrowUpRightIcon size={12} />
            </a>
          </div>

          <nav className="sp-footer-col" aria-label="Documentación legal y privacidad">
            <span className="sp-footer-heading">Legal</span>
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
            <button type="button" className="sp-footer-cookie-btn" onClick={openConfig}>
              Configurar cookies
            </button>
          </nav>
        </div>

        <div className="sp-footer-bottom">
          <p className="sp-footer-copy">
            © {currentYear} {personalProfile.name} · Desarrollador de software en Argentina
          </p>
          <a
            href="#inicio"
            className="sp-back-top"
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
