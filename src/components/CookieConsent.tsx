import React, { useEffect, useState } from 'react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { CheckIcon, CloseIcon, ShieldIcon } from './Icons';

export const CookieConsent: React.FC = () => {
  const {
    consent,
    hasResponded,
    isBannerVisible,
    isConfigOpen,
    acceptAll,
    acceptNecessaryOnly,
    savePreferences,
    openConfig,
    closeConfig,
    navigateTo,
  } = useCookieConsent();

  const [prefEnabled, setPrefEnabled] = useState<boolean>(consent.preferences);
  const [analyticsEnabled, setAnalyticsEnabled] = useState<boolean>(consent.analytics);

  useEffect(() => {
    if (isConfigOpen) {
      setPrefEnabled(consent.preferences);
      setAnalyticsEnabled(consent.analytics);
    }
  }, [isConfigOpen, consent.preferences, consent.analytics]);

  useEffect(() => {
    if (!isConfigOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeConfig();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isConfigOpen, closeConfig]);

  const handleLink = (
    e: React.MouseEvent<HTMLAnchorElement>,
    path: '/privacidad' | '/cookies'
  ) => {
    e.preventDefault();
    closeConfig();
    navigateTo(path);
  };

  const formattedUpdatedAt = (() => {
    if (!hasResponded || !consent.updatedAt) return null;
    try {
      return new Intl.DateTimeFormat('es-AR', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(consent.updatedAt));
    } catch {
      return consent.updatedAt;
    }
  })();

  return (
    <>
      {isBannerVisible && (
        <aside
          className="studio-cookie-banner"
          role="region"
          aria-label="Aviso de privacidad y cookies"
        >
          <div className="studio-cookie-banner-head">
            <span className="studio-cookie-badge">
              <ShieldIcon size={13} />
              <span>Privacidad y Almacenamiento</span>
            </span>
          </div>

          <p className="studio-cookie-banner-text">
            Usamos almacenamiento local técnico y opcional para preferencias, sin trackers ni
            cookies publicitarias. Ver{' '}
            <a href="/cookies" onClick={(e) => handleLink(e, '/cookies')}>
              Cookies
            </a>{' '}
            y{' '}
            <a href="/privacidad" onClick={(e) => handleLink(e, '/privacidad')}>
              Privacidad
            </a>
            .
          </p>

          <div className="studio-cookie-banner-actions">
            <button
              type="button"
              className="studio-cookie-btn-primary"
              onClick={acceptAll}
            >
              Aceptar todas
            </button>
            <button
              type="button"
              className="studio-cookie-btn-secondary"
              onClick={acceptNecessaryOnly}
            >
              Solo necesarias
            </button>
            <button
              type="button"
              className="studio-cookie-btn-ghost"
              onClick={openConfig}
            >
              Configurar
            </button>
          </div>
        </aside>
      )}

      {isConfigOpen && (
        <div
          className="studio-cookie-backdrop"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeConfig();
          }}
        >
          <div
            className="studio-cookie-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cookie-config-title"
          >
            <div className="studio-cookie-modal-head">
              <div>
                <span className="studio-cookie-badge">
                  <ShieldIcon size={13} />
                  <span>Gestión de Consentimiento</span>
                </span>
                <h2 id="cookie-config-title" className="studio-cookie-modal-title">
                  Preferencias de privacidad y cookies
                </h2>
              </div>

              <button
                type="button"
                className="studio-cookie-close-btn"
                onClick={closeConfig}
                aria-label="Cerrar panel de preferencias"
              >
                <CloseIcon size={18} />
              </button>
            </div>

            <p className="studio-cookie-modal-desc">
              Elige qué categorías de almacenamiento local deseas permitir. Puedes revisar el
              detalle de cada clave en nuestra{' '}
              <a href="/cookies" onClick={(e) => handleLink(e, '/cookies')}>
                Política de Cookies
              </a>
              .
            </p>

            <div className="studio-cookie-categories">
              {/* 1. Estrictamente necesarias */}
              <div className="studio-cookie-category-card">
                <div className="studio-cookie-cat-info">
                  <div className="studio-cookie-cat-title-row">
                    <strong>Estrictamente necesarias (Técnicas)</strong>
                    <span className="studio-cookie-always-on">
                      <CheckIcon size={12} />
                      <span>Siempre activas</span>
                    </span>
                  </div>
                  <p>
                    Necesarias para guardar esta elección de consentimiento (
                    <code>gf-cookie-consent-v1</code>) y garantizar la seguridad básica de
                    navegación.
                  </p>
                </div>
              </div>

              {/* 2. Preferencias y funcionalidad */}
              <div className="studio-cookie-category-card">
                <div className="studio-cookie-cat-info">
                  <div className="studio-cookie-cat-title-row">
                    <strong id="cookie-cat-pref">Preferencias y accesibilidad</strong>
                  </div>
                  <p>
                    Permite guardar en <code>localStorage</code> tu preferencia de Modo Calmo (
                    <code>gf-studio-calm-mode</code>) y Modo Ligero (
                    <code>gf-studio-lite-mode</code>).
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={prefEnabled}
                  aria-labelledby="cookie-cat-pref"
                  className={`studio-cookie-switch ${prefEnabled ? 'is-on' : ''}`}
                  onClick={() => setPrefEnabled((v) => !v)}
                >
                  <span className="studio-cookie-switch-thumb" />
                </button>
              </div>

              {/* 3. Analíticas */}
              <div className="studio-cookie-category-card">
                <div className="studio-cookie-cat-info">
                  <div className="studio-cookie-cat-title-row">
                    <strong id="cookie-cat-analytics">Analíticas y medición</strong>
                  </div>
                  <p>
                    Actualmente el sitio no ejecuta scripts analíticos ni telemetría de terceros.
                    Mantener desactivado bloquea cualquier medición opcional futura.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={analyticsEnabled}
                  aria-labelledby="cookie-cat-analytics"
                  className={`studio-cookie-switch ${analyticsEnabled ? 'is-on' : ''}`}
                  onClick={() => setAnalyticsEnabled((v) => !v)}
                >
                  <span className="studio-cookie-switch-thumb" />
                </button>
              </div>
            </div>

            {formattedUpdatedAt && (
              <p className="studio-cookie-timestamp">
                Última preferencia registrada: <time dateTime={consent.updatedAt}>{formattedUpdatedAt}</time>
              </p>
            )}

            <div className="studio-cookie-modal-footer">
              <button
                type="button"
                className="studio-cookie-btn-secondary"
                onClick={acceptNecessaryOnly}
              >
                Solo necesarias
              </button>
              <button
                type="button"
                className="studio-cookie-btn-secondary"
                onClick={() =>
                  savePreferences({
                    preferences: prefEnabled,
                    analytics: analyticsEnabled,
                  })
                }
              >
                Guardar preferencias
              </button>
              <button
                type="button"
                className="studio-cookie-btn-primary"
                onClick={acceptAll}
              >
                Aceptar todas
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
