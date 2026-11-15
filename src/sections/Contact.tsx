import React, { useState } from 'react';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from '../components/GFLogo';
import {
  ArrowUpRightIcon,
  CheckIcon,
  CopyIcon,
  GitHubIcon,
  LinkedInIcon,
} from '../components/Icons';

const TOPIC_OPTIONS = [
  'Desarrollo Web',
  'Backend / Datos',
  'Pasantía Técnica',
  'Colaboración',
] as const;

const FLOATING_CURSORS = [
  { label: 'Backend & APIs', color: '#38bdf8', ink: '#04121d' },
  { label: 'PostgreSQL · SQL', color: '#c4b5fd', ink: '#140b24' },
  { label: 'React · TypeScript', color: '#67e8f9', ink: '#03191e' },
  { label: 'Desarrollador en formación', color: '#f472b6', ink: '#1f0614' },
] as const;

interface FormState {
  name: string;
  email: string;
  message: string;
  topics: string[];
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const Contact: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: '',
    email: '',
    message: '',
    topics: ['Desarrollo Web'],
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [preparedMailto, setPreparedMailto] = useState<string | null>(null);

  const handleCopyEmail = async () => {
    const email = personalProfile.contact.email;
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = email;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
      } finally {
        document.body.removeChild(textarea);
      }
    }
    window.setTimeout(() => setCopied(false), 2600);
  };

  const toggleTopic = (topic: string) => {
    setForm((prev) => {
      const exists = prev.topics.includes(topic);
      const nextTopics = exists
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic];
      return { ...prev, topics: nextTopics };
    });
  };

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {};
    if (form.name.trim().length < 2) {
      nextErrors.name = 'Ingresa tu nombre o referencia (mínimo 2 caracteres).';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Ingresa un correo electrónico válido.';
    }
    if (form.message.trim().length < 10) {
      nextErrors.message = 'Escribe un mensaje breve de al menos 10 caracteres.';
    }
    return nextErrors;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      setPreparedMailto(null);
      return;
    }

    const topicPrefix = form.topics.length > 0 ? `[${form.topics.join(', ')}] ` : '';
    const subject = encodeURIComponent(`${topicPrefix}Contacto desde portafolio — ${form.name.trim()}`);
    const body = encodeURIComponent(
      `Nombre: ${form.name.trim()}\nCorreo: ${form.email.trim()}\nInterés: ${
        form.topics.join(', ') || 'Consulta general'
      }\n\nMensaje:\n${form.message.trim()}`
    );
    const mailtoHref = `mailto:${personalProfile.contact.email}?subject=${subject}&body=${body}`;
    setPreparedMailto(mailtoHref);
  };

  return (
    <section
      id="contacto"
      className="studio-section studio-contact-section"
      aria-labelledby="contact-heading"
    >
      {/* Escenario de cursores autónomos colaborativos estilo .rg */}
      <div className="studio-rg-banner">
        <div className="studio-rg-cursors" aria-hidden="true">
          {FLOATING_CURSORS.map((cursor, idx) => (
            <div
              key={cursor.label}
              className={`studio-rg-cursor studio-cursor-orbit-${idx}`}
              style={
                {
                  '--c': cursor.color,
                  '--ink': cursor.ink,
                } as React.CSSProperties
              }
            >
              <svg viewBox="0 0 20 24" className="studio-rg-cursor-arrow">
                <path d="M1.5 1.5L6.5 21L10.5 13.8L18.5 11.2L1.5 1.5Z" />
              </svg>
              <span className="studio-rg-cursor-tag">{cursor.label}</span>
            </div>
          ))}
        </div>

        <div className="studio-container studio-rg-cta">
          <div className="studio-section-kicker-wrap">
            <span className="studio-kicker-label">Contacto · Conversación Directa</span>
          </div>

          <h2 id="contact-heading" className="studio-rg-cta-say">
            ¿Tienes un proyecto o propuesta técnica?{' '}
            <span className="studio-text-chrome-accent">Hagámoslo realidad.</span>
          </h2>
        </div>
      </div>

      <div className="studio-container studio-booking-wrap">
        <p className="studio-booking">
          <span>
            <b>{personalProfile.hero.label}</b> · {personalProfile.availabilityText}
          </span>
        </p>
      </div>

      {/* Consola de mensaje estilo .brief + canales directos */}
      <div className="studio-container studio-brief-layout">
        <div className="studio-contact-editorial">
          <div className="studio-contact-gf-bar">
            <GFLogo variant="footer" showSubtitle={false} size={42} />
            <div className="studio-contact-identity-text">
              <span className="studio-badge-chrome">{personalProfile.hero.label}</span>
              <span>
                {personalProfile.location} · {personalProfile.timeZoneLabel}
              </span>
            </div>
          </div>

          <div className="studio-email-card">
            <div className="studio-email-meta">
              <span className="studio-email-label">Correo electrónico directo</span>
              <a
                href={`mailto:${personalProfile.contact.email}`}
                className="studio-email-address"
              >
                {personalProfile.contact.email}
              </a>
            </div>

            <button
              type="button"
              className={`studio-copy-btn ${copied ? 'is-copied' : ''}`}
              onClick={handleCopyEmail}
              aria-label="Copiar dirección de correo electrónico"
            >
              {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
              <span className="studio-ft-copied" data-on={copied ? 'true' : undefined}>
                ¡Listo!
              </span>
            </button>
          </div>

          <div className="studio-contact-channels">
            <a
              href={personalProfile.contact.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-channel-pill"
            >
              <GitHubIcon size={15} />
              <span>GitHub</span>
              <ArrowUpRightIcon size={13} />
            </a>

            <a
              href={personalProfile.contact.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="studio-channel-pill"
            >
              <LinkedInIcon size={15} />
              <span>LinkedIn</span>
              <ArrowUpRightIcon size={13} />
            </a>

            <a
              href="https://biofuego.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="studio-channel-pill"
            >
              <span>Biofuego Web</span>
              <ArrowUpRightIcon size={13} />
            </a>

            <a
              href="https://radiogravity.web.app"
              target="_blank"
              rel="noopener noreferrer"
              className="studio-channel-pill"
            >
              <span>Radio Gravity</span>
              <ArrowUpRightIcon size={13} />
            </a>
          </div>
        </div>

        {/* Formulario agrupado estilo .brief con floating labels y píldoras con rebote */}
        <div className="studio-contact-form-wrap">
          {!preparedMailto ? (
            <form className="studio-bf-paper" onSubmit={handleSubmit} noValidate>
              <fieldset className="studio-bf-picks">
                <legend className="studio-bf-legend">¿Sobre qué te gustaría conversar?</legend>
                <div className="studio-bf-pills">
                  {TOPIC_OPTIONS.map((topic, idx) => {
                    const checked = form.topics.includes(topic);
                    return (
                      <label
                        key={topic}
                        className="studio-bf-pill"
                        style={{ '--j': idx } as React.CSSProperties}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleTopic(topic)}
                        />
                        <span>{topic}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="studio-bf-group">
                <div className={`studio-bf-field ${errors.name ? 'has-error' : ''}`}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder=" "
                    className="studio-bf-input"
                    value={form.name}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                    }}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                  <label htmlFor="contact-name" className="studio-bf-label">
                    Nombre o empresa
                  </label>
                </div>

                <div className={`studio-bf-field ${errors.email ? 'has-error' : ''}`}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder=" "
                    className="studio-bf-input"
                    value={form.email}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                    }}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                  <label htmlFor="contact-email" className="studio-bf-label">
                    Correo electrónico
                  </label>
                </div>

                <div
                  className={`studio-bf-field studio-bf-tall ${
                    errors.message ? 'has-error' : ''
                  }`}
                >
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    placeholder=" "
                    className="studio-bf-input"
                    value={form.message}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, message: e.target.value }));
                      if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
                    }}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  <label htmlFor="contact-message" className="studio-bf-label">
                    Cuéntame sobre tu proyecto, equipo o búsqueda...
                  </label>
                </div>
              </div>

              {(errors.name || errors.email || errors.message) && (
                <div className="studio-form-errors-box" role="alert">
                  {errors.name && <span id="contact-name-error">{errors.name}</span>}
                  {errors.email && <span id="contact-email-error">{errors.email}</span>}
                  {errors.message && <span id="contact-message-error">{errors.message}</span>}
                </div>
              )}

              <button type="submit" className="studio-bf-send">
                <span>Preparar mensaje</span>
                <ArrowUpRightIcon size={16} className="studio-rg-arrow" />
              </button>
            </form>
          ) : (
            <div className="studio-bf-sent" data-in="true" role="status" aria-live="polite">
              <div className="studio-bf-done" aria-hidden="true">
                <svg viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="24" />
                  <path d="M16 27L23 34L36 19" />
                </svg>
              </div>
              <h3 className="studio-bf-sent-say">Consulta lista para enviar.</h3>
              <p className="studio-bf-sent-note">
                Abre tu aplicación de correo configurada para enviársela directamente a{' '}
                <strong>{personalProfile.contact.email}</strong>.
              </p>
              <div className="studio-sent-actions">
                <a href={preparedMailto} className="studio-pj-visit">
                  <span>Abrir cliente de correo</span>
                  <ArrowUpRightIcon size={15} className="studio-rg-arrow" />
                </a>
                <button
                  type="button"
                  className="studio-bf-again"
                  onClick={() => setPreparedMailto(null)}
                >
                  Editar mensaje
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
