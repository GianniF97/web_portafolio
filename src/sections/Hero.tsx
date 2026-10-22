import React, { memo } from 'react';
import { personalProfile } from '../data/portfolioData';
import { ArchitecturalShape } from '../components/ArchitecturalShape';
import {
  ArrowDownRightIcon,
  GitHubIcon,
  LinkedInIcon,
  ArrowUpRightIcon,
} from '../components/Icons';

/**
 * Sección Hero de Brikken+Co:
 * - Grilla arquitectónica de 4 columnas de fondo.
 * - Gran titular tipo banner a todo el ancho.
 * - Escultura tridimensional geométrica en el centro interactiva con scroll y cursor.
 * - Declaración de propósito en la esquina inferior con botón de acción directo.
 * - Coordenadas y enlaces a repositorios reales.
 */
export const Hero: React.FC = memo(() => {
  return (
    <section id="inicio" className="brikken-hero-monumental" aria-labelledby="hero-main-title">
      <div className="brikken-container hero-inner-container">
        {/* Banner Superior: Gran Título / Wordmark de Identidad */}
        <div className="hero-banner-headline-wrap">
          <div className="hero-top-eyebrow-row">
            <span className="eyebrow-bracket" aria-hidden="true">[</span>
            <span className="eyebrow-text">GIANNI FERRARI // PORTAFOLIO TÉCNICO</span>
            <span className="eyebrow-bracket" aria-hidden="true">]</span>
            <span className="eyebrow-sep" aria-hidden="true">·</span>
            <span className="eyebrow-location">{personalProfile.location.toUpperCase()} ({personalProfile.timeZoneLabel})</span>
          </div>

          <h1 id="hero-main-title" className="hero-banner-display-text">
            SISTEMAS PENSADOS DESDE LOS DATOS
          </h1>
        </div>

        {/* Centro de la Escena: Escultura 3D Poliédrica Estilo Concreto de Brikken */}
        <div className="hero-center-sculpture-slot">
          <ArchitecturalShape />
        </div>

        {/* Zona Inferior: Proposición de Negocio y Acciones */}
        <div className="hero-bottom-statement-block">
          <div className="hero-statement-column">
            <p className="hero-statement-p">
              Desarrollador de software &amp; estudiante avanzado de Analista de Sistemas en Argentina.
              Construyo aplicaciones web y sistemas de gestión con <strong>Python</strong>, <strong>Flask</strong> y <strong>bases de datos relacionales (DER)</strong>, junto con interfaces modernas en <strong>React &amp; TypeScript</strong>.
            </p>

            <div className="hero-action-btns-row">
              <a href="#proyectos" className="brikken-pill-btn-primary">
                <span>VER PROYECTOS</span>
                <ArrowDownRightIcon size={14} />
              </a>

              <a href="#contacto" className="brikken-pill-btn-secondary">
                <span>CONTACTAR</span>
                <ArrowUpRightIcon size={13} />
              </a>
            </div>
          </div>

          {/* Ficha de Coordenadas Rápidas en la derecha */}
          <div className="hero-quick-ledger-column">
            <div className="quick-ledger-card">
              <div className="ledger-head">
                <span className="ledger-label">FICHA TÉCNICA</span>
                <span className="ledger-id tabular-nums">№ 01-A</span>
              </div>
              <ul className="ledger-list">
                <li className="ledger-item">
                  <span className="ledger-k">FORMACIÓN</span>
                  <strong className="ledger-v">{personalProfile.about.education}</strong>
                </li>
                <li className="ledger-item">
                  <span className="ledger-k">CORE</span>
                  <span className="ledger-v">Python / Flask (MVC) · PostgreSQL / MySQL · React</span>
                </li>
                <li className="ledger-item">
                  <span className="ledger-k">DEMO ACTIVA</span>
                  <a
                    href="https://sistema-fotos.vercel.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ledger-link"
                  >
                    <span>sistema-fotos.vercel.app</span>
                    <ArrowUpRightIcon size={11} />
                  </a>
                </li>
              </ul>

              <div className="ledger-socials-row">
                {personalProfile.contact.githubUrl && (
                  <a
                    href={personalProfile.contact.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ledger-social-link"
                    aria-label="GitHub de Gianni Ferrari"
                  >
                    <GitHubIcon size={14} />
                    <span>GitHub</span>
                  </a>
                )}
                {personalProfile.contact.linkedinUrl && (
                  <a
                    href={personalProfile.contact.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ledger-social-link"
                    aria-label="LinkedIn de Gianni Ferrari"
                  >
                    <LinkedInIcon size={14} />
                    <span>LinkedIn</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';

export default Hero;
