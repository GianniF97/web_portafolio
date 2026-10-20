import React, { memo } from 'react';
import { personalProfile } from '../data/portfolioData';
import { GitHubIcon, LinkedInIcon, MailIcon, ArrowUpIcon } from './Icons';

export const Footer: React.FC = memo(() => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="brikken-footer" role="contentinfo">
      <div className="brikken-container">
        {/* Columnas superiores del pie */}
        <div className="footer-top-columns">
          <div className="footer-brand-bio">
            <a href="#inicio" className="footer-brand-title" aria-label="Ir al inicio">
              [GF] GIANNI FERRARI
            </a>
            <p className="footer-brand-sub">
              {personalProfile.roleTag} · {personalProfile.about.education}.
              <br />
              {personalProfile.location} ({personalProfile.timeZoneLabel}).
            </p>
            <p className="footer-brand-sub" style={{ color: 'var(--text-muted)' }}>
              Ingeniería de software con foco en consistencia de datos relacionales, arquitectura limpia y código mantenible.
            </p>
          </div>

          <div>
            <h3 className="footer-column-title">Índice del Portafolio</h3>
            <ul className="footer-links-list">
              <li className="footer-link-item"><a href="#inicio">00. Inicio</a></li>
              <li className="footer-link-item"><a href="#proyectos">01. Proyectos</a></li>
              <li className="footer-link-item"><a href="#sobre-mi">02. Sobre mí</a></li>
              <li className="footer-link-item"><a href="#tecnologias">03. Stack</a></li>
              <li className="footer-link-item"><a href="#aprendizaje">04. Bitácora</a></li>
              <li className="footer-link-item"><a href="#contacto">05. Contacto</a></li>
            </ul>
          </div>

          <div>
            <h3 className="footer-column-title">Canales &amp; Conexión</h3>
            <ul className="footer-links-list">
              {personalProfile.contact.githubUrl && (
                <li className="footer-link-item">
                  <a
                    href={personalProfile.contact.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <GitHubIcon size={14} />
                    <span>GitHub (@GianniF97)</span>
                  </a>
                </li>
              )}
              {personalProfile.contact.linkedinUrl && (
                <li className="footer-link-item">
                  <a
                    href={personalProfile.contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                  >
                    <LinkedInIcon size={14} />
                    <span>LinkedIn</span>
                  </a>
                </li>
              )}
              <li className="footer-link-item">
                <a
                  href={`mailto:${personalProfile.contact.email}`}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <MailIcon size={14} />
                  <span>Correo directo</span>
                </a>
              </li>
            </ul>

            <div style={{ marginTop: '1.5rem' }}>
              <a href="#inicio" className="footer-back-top-btn" aria-label="Volver arriba">
                <span>Volver arriba</span>
                <ArrowUpIcon size={11} />
              </a>
            </div>
          </div>
        </div>

        {/* Firma Tipográfica Monumental Brikken */}
        <div className="footer-wordmark-container" aria-hidden="true">
          <div className="footer-monumental-wordmark">
            GIANNI FERRARI
          </div>
        </div>

        {/* Colofón inferior */}
        <div className="footer-bottom-row">
          <span>
            © {currentYear} {personalProfile.name} ({personalProfile.githubHandle}).
          </span>
          <span>
            ARQUITECTURA REACT 18 + TYPESCRIPT · CSS ARQUITECTÓNICO · {personalProfile.location.toUpperCase()} ({personalProfile.timeZoneLabel})
          </span>
        </div>
      </div>
    </footer>
  );
});
Footer.displayName = 'Footer';

export default Footer;
