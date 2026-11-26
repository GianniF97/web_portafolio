import React, { useEffect, useRef, useState } from 'react';
import { personalProfile } from '../data/portfolioData';
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from '../components/Icons';

export const Contact: React.FC = () => {
  const { contact } = personalProfile;
  const [copied, setCopied] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sentHint, setSentHint] = useState(false);

  const copyTimerRef = useRef<number | null>(null);
  const sentTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
      if (sentTimerRef.current !== null) window.clearTimeout(sentTimerRef.current);
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(contact.email);
      setCopied(true);
    } catch {
      setCopied(true);
    }
    if (copyTimerRef.current !== null) window.clearTimeout(copyTimerRef.current);
    copyTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copyTimerRef.current = null;
    }, 2200);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const mailSubject = encodeURIComponent(
      subject.trim() || 'Contacto desde tu portafolio — Gianni Ferrari'
    );
    const mailBody = encodeURIComponent(message.trim());
    window.location.href = `mailto:${contact.email}?subject=${mailSubject}&body=${mailBody}`;
    setSentHint(true);
    if (sentTimerRef.current !== null) window.clearTimeout(sentTimerRef.current);
    sentTimerRef.current = window.setTimeout(() => {
      setSentHint(false);
      sentTimerRef.current = null;
    }, 3500);
  };

  return (
    <section id="contacto" className="sp-section sp-contact" aria-labelledby="contact-heading">
      <div className="sp-container">
        <div className="sp-contact-grid">
          <div className="sp-contact-info sp-reveal">
            <p className="sp-eyebrow">Contacto directo</p>
            <h2 id="contact-heading" className="sp-contact-title">
              {contact.headline}
            </h2>
            <p className="sp-body-copy">{contact.description}</p>

            <div className="sp-email-box">
              <MailIcon size={16} />
              <a href={`mailto:${contact.email}`} className="sp-email-link">
                {contact.email}
              </a>
              <button
                type="button"
                className="sp-copy-btn"
                onClick={handleCopyEmail}
                aria-label="Copiar dirección de correo"
              >
                {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>

            <ul className="sp-contact-links" aria-label="Redes y sitios en producción">
              <li>
                <a href={contact.githubUrl} target="_blank" rel="noopener noreferrer">
                  <GitHubIcon size={15} />
                  <span>GitHub ({personalProfile.githubHandle})</span>
                  <ArrowUpRightIcon size={13} />
                </a>
              </li>
              <li>
                <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer">
                  <LinkedInIcon size={15} />
                  <span>LinkedIn profesional</span>
                  <ArrowUpRightIcon size={13} />
                </a>
              </li>
              {contact.otherLinks.slice(2).map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    <span>{link.label}</span>
                    <ArrowUpRightIcon size={13} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <form className="sp-glass-card sp-contact-form sp-reveal" onSubmit={handleSubmit}>
            <div className="sp-field">
              <label htmlFor="contact-subject">Asunto</label>
              <input
                id="contact-subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Pasantía, proyecto o consulta técnica"
                maxLength={120}
              />
            </div>

            <div className="sp-field">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Contame brevemente sobre el proyecto, equipo o consulta..."
                required
              />
            </div>

            <div className="sp-form-actions">
              <button type="submit" className="sp-btn-primary">
                <span>Abrir cliente de correo</span>
                <ArrowUpRightIcon size={15} />
              </button>
              <span className="sp-form-note" aria-live="polite">
                {sentHint
                  ? 'Abriendo tu aplicación de correo con el borrador listo.'
                  : 'Se abrirá tu cliente de correo configurado con el mensaje precompletado.'}
              </span>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
