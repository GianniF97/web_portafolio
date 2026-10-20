import React, { useState, memo } from 'react';
import { personalProfile } from '../data/portfolioData';
import {
  MailIcon,
  GitHubIcon,
  LinkedInIcon,
  CopyIcon,
  CheckIcon,
  ArrowUpRightIcon,
} from '../components/Icons';

export const Contact: React.FC = memo(() => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const { contact } = personalProfile;

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopiedEmail(true);
      window.setTimeout(() => setCopiedEmail(false), 2400);
    } catch {
      setCopiedEmail(false);
    }
  };

  return (
    <section id="contacto" className="brikken-section reveal-section" aria-labelledby="contact-heading">
      <div className="brikken-container">
        {/* Cabecera Brikken */}
        <div className="section-header-block">
          <div className="section-eyebrow-row">
            <span aria-hidden="true">[</span>
            <span>05 // CONTACTO &amp; CANAL DIRECTO</span>
            <span aria-hidden="true">]</span>
          </div>
        </div>

        {/* Tarjeta de Contacto Arquitectónica Brikken */}
        <div className="brikken-contact-card reveal-card">
          <div className="contact-headline-row">
            <h2 id="contact-heading" className="contact-display-headline">
              ¿Tenés un proyecto o desafío técnico?
              <br />
              Construyámoslo con rigor.
            </h2>
            <p className="contact-lead-desc">
              {contact.description}
            </p>
          </div>

          {/* Bloque de Correo Electrónico Principal */}
          <div className="contact-email-action-block">
            <div>
              <span className="dossier-item-key" style={{ display: 'block', marginBottom: '0.4rem' }}>
                CANAL PRINCIPAL // RESPUESTA DIRECTA
              </span>
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  'Contacto desde portafolio — Gianni Ferrari'
                )}`}
                className="email-address-display"
                aria-label={`Enviar correo electrónico a ${contact.email}`}
              >
                {contact.email}
              </a>
            </div>

            <div className="contact-button-cluster">
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  'Contacto desde portafolio — Gianni Ferrari'
                )}`}
                className="brikken-btn-primary"
              >
                <MailIcon size={15} />
                <span>Escribir correo</span>
                <ArrowUpRightIcon size={12} />
              </a>

              <button
                type="button"
                className={`btn-copy-address ${copiedEmail ? 'is-copied' : ''}`}
                onClick={handleCopyEmail}
                aria-label="Copiar dirección de correo electrónico al portapapeles"
              >
                {copiedEmail ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
                <span>{copiedEmail ? 'Copiado al portapapeles' : 'Copiar dirección'}</span>
              </button>
            </div>
          </div>

          {/* Canales Verificados */}
          <div>
            <span className="dossier-item-key" style={{ display: 'block', marginBottom: '0.875rem' }}>
              PERFILES PROFESIONALES VERIFICADOS
            </span>
            <div className="contact-verified-channels">
              {contact.githubUrl && (
                <a
                  href={contact.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="verified-channel-link"
                >
                  <GitHubIcon size={15} />
                  <span>GitHub (@GianniF97)</span>
                  <ArrowUpRightIcon size={11} />
                </a>
              )}

              {contact.linkedinUrl && (
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="verified-channel-link"
                >
                  <LinkedInIcon size={15} />
                  <span>LinkedIn</span>
                  <ArrowUpRightIcon size={11} />
                </a>
              )}

              <a
                href="https://sistema-fotos.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="verified-channel-link"
              >
                <span>Demo: Galería Vercel</span>
                <ArrowUpRightIcon size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
Contact.displayName = 'Contact';

export default Contact;
