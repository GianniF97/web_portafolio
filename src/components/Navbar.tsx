import React, { useEffect, useRef, useState } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from './GFLogo';
import { ArrowUpRightIcon, CloseIcon, GitHubIcon, LinkedInIcon } from './Icons';

const NAV_ITEMS = [
  { id: 'inicio', href: '#inicio', label: 'Inicio' },
  { id: 'sobre-mi', href: '#sobre-mi', label: 'Sobre mí' },
  { id: 'tecnologias', href: '#tecnologias', label: 'Tecnologías' },
  { id: 'proyectos', href: '#proyectos', label: 'Proyectos' },
  { id: 'contacto', href: '#contacto', label: 'Contacto' },
] as const;

function getArgentinaTime(): string {
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

export const Navbar: React.FC = () => {
  const { calmMode, liteMode, toggleCalmMode, toggleLiteMode } = useDisplayMode();
  const [activeId, setActiveId] = useState<string>('inicio');
  const [notchOpen, setNotchOpen] = useState<boolean>(false);
  const [isPastHero, setIsPastHero] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>(() => getArgentinaTime());
  const [toastText, setToastText] = useState<string | null>(null);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [cursorVisible, setCursorVisible] = useState<boolean>(false);

  const notchRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLSpanElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLocalTime(getArgentinaTime());
    }, 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setIsPastHero(window.scrollY > window.innerHeight * 0.45);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionIds = NAV_ITEMS.map((item) => item.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!elements.length || typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-22% 0px -55% 0px',
        threshold: [0.08, 0.3, 0.55],
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!notchOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setNotchOpen(false);
      }
    };
    const handlePointerDown = (event: PointerEvent) => {
      if (notchRef.current && !notchRef.current.contains(event.target as Node)) {
        setNotchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [notchOpen]);

  // Sistema global de cursor dual (punto difference + píldora líquida contextual)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || calmMode || reducedMotion) {
      setCursorVisible(false);
      setCursorLabel(null);
      return;
    }

    let targetX = -100;
    let targetY = -100;
    let currentX = -100;
    let currentY = -100;
    let rafId = 0;

    const handlePointerMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      setCursorVisible(true);

      const targetEl = event.target as HTMLElement | null;
      const labeled = targetEl?.closest?.('[data-cursor-label]') as HTMLElement | null;
      setCursorLabel(labeled?.dataset?.cursorLabel || null);
    };

    const handlePointerLeave = () => {
      setCursorVisible(false);
      setCursorLabel(null);
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.24;
      currentY += (targetY - currentY) * 0.24;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      if (pillRef.current) {
        pillRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = window.requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    rafId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
    };
  }, [calmMode]);

  const showToast = (message: string) => {
    setToastText(message);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastText(null);
    }, 2400);
  };

  const handleToggleCalm = () => {
    const next = !calmMode;
    toggleCalmMode();
    showToast(next ? 'Modo calmo activado: movimiento reducido' : 'Animaciones completas activadas');
  };

  const handleToggleLite = () => {
    const next = !liteMode;
    toggleLiteMode();
    showToast(next ? 'Modo ligero ON: menor carga gráfica' : 'Modo 3D WebGL completo activado');
  };

  const activeItem = NAV_ITEMS.find((item) => item.id === activeId) ?? NAV_ITEMS[0];

  return (
    <>
      {/* Notificación flotante de cambio de modo (.lag-note) */}
      {toastText && (
        <div className="studio-lag-note" role="status" aria-live="polite">
          <svg viewBox="0 0 28 14" className="studio-lag-note-battery" aria-hidden="true">
            <rect
              x="1"
              y="1"
              width="22"
              height="12"
              rx="3"
              fill="none"
              stroke="currentColor"
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <rect x="24" y="4.5" width="2.5" height="5" rx="1" fill="currentColor" fillOpacity="0.5" />
            <rect
              x="3"
              y="3"
              width="18"
              height="8"
              rx="1.5"
              fill={liteMode ? '#fc0' : 'currentColor'}
              style={{ transformOrigin: '3px 7px', transform: liteMode ? 'scaleX(0.35)' : 'scaleX(1)' }}
            />
          </svg>
          <span>{toastText}</span>
        </div>
      )}

      {/* Barra fija accesible en Modo Calmo */}
      {calmMode && (
        <nav className="studio-access-bar" aria-label="Navegación directa accesible">
          <a href="#inicio" className="studio-access-brand">
            <GFLogo variant="navbar" showSubtitle={false} size={28} />
            <span>Gianni Ferrari</span>
          </a>
          <div className="studio-access-links">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                aria-current={activeId === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <div className="studio-access-modes">
            <button type="button" onClick={handleToggleCalm} aria-pressed={calmMode}>
              Desactivar modo calmo
            </button>
          </div>
        </nav>
      )}

      {/* Controles icónicos superiores (.hm) al estilo wowww.art */}
      <div className="studio-hm-bar" aria-label="Preferencias visuales y accesibilidad">
        <div className="studio-hm-item">
          <button
            type="button"
            className={`studio-hm-btn studio-hm-access ${calmMode ? 'is-on' : ''}`}
            onClick={handleToggleCalm}
            aria-pressed={calmMode}
            aria-label="Modo accesibilidad y reducción de movimiento"
          >
            <svg viewBox="0 0 24 24" className="studio-hm-icon" aria-hidden="true">
              <circle className="studio-hm-round" cx="12" cy="12" r="10" />
              <circle cx="12" cy="7.5" r="1.4" fill="currentColor" />
              <path
                className="studio-hm-figure"
                d="M7.5 10.5h9M12 10.5v4.2M12 14.7l-2.6 4.3M12 14.7l2.6 4.3"
              />
            </svg>
          </button>
          <div className="studio-hm-tip" role="tooltip">
            <div className="studio-hm-tip-top">
              <span className="studio-hm-tip-name">Modo accesible</span>
              <span className={`studio-hm-tip-state ${calmMode ? 'is-on' : ''}`}>
                {calmMode ? 'ON' : 'OFF'}
              </span>
            </div>
            <span className="studio-hm-tip-line">
              Actívalo para navegación estática, scroll directo y foco reforzado.
            </span>
          </div>
        </div>

        <div className="studio-hm-item">
          <button
            type="button"
            className={`studio-hm-btn studio-hm-lag ${liteMode ? 'is-on' : ''}`}
            onClick={handleToggleLite}
            aria-pressed={liteMode}
            aria-label="Modo ligero para menor carga gráfica"
          >
            <svg viewBox="0 0 28 14" className="studio-hm-battery" aria-hidden="true">
              <rect
                x="1"
                y="1"
                width="22"
                height="12"
                rx="3.2"
                className="studio-hm-shell"
              />
              <rect x="24.2" y="4.5" width="2.2" height="5" rx="1" className="studio-hm-nub" />
              <rect
                x="3"
                y="3"
                width="18"
                height="8"
                rx="1.5"
                className={`studio-hm-level ${liteMode ? 'is-lite' : ''}`}
              />
            </svg>
          </button>
          <div className="studio-hm-tip" role="tooltip">
            <div className="studio-hm-tip-top">
              <span className="studio-hm-tip-name">Reducir carga 3D</span>
              <span className={`studio-hm-tip-state ${liteMode ? 'is-warn' : ''}`}>
                {liteMode ? 'ON' : 'OFF'}
              </span>
            </div>
            <span className="studio-hm-tip-line">
              Modo liviano: conserva el contenido con alternativa gráfica ligera.
            </span>
          </div>
        </div>
      </div>

      {/* Dynamic Island / Notch Central Fijo */}
      {!calmMode && (
        <div
          ref={notchRef}
          className={`studio-notch ${notchOpen ? 'is-open' : ''} ${
            isPastHero ? 'is-scrolled' : ''
          }`}
        >
          <button
            type="button"
            className="studio-notch-tap"
            aria-expanded={notchOpen}
            aria-controls="studio-notch-panel"
            aria-label="Abrir centro de navegación rápida GF"
            onClick={() => setNotchOpen((prev) => !prev)}
          >
            <GFLogo variant="navbar" showSubtitle={false} size={18} />
            <span className="studio-notch-section-name">{activeItem.label}</span>
            <span className="studio-notch-time-mini">{localTime}</span>
          </button>

          {notchOpen && (
            <div
              id="studio-notch-panel"
              className="studio-notch-panel"
              role="dialog"
              aria-modal="false"
              aria-label="Navegación y estado de estudio"
            >
              <div className="studio-nt-top">
                <nav className="studio-nt-tabs" aria-label="Secciones del portafolio">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeId === item.id;
                    return (
                      <a
                        key={item.id}
                        href={item.href}
                        className="studio-nt-tab"
                        aria-current={isActive ? 'page' : undefined}
                        onClick={() => setNotchOpen(false)}
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </nav>

                <button
                  type="button"
                  className="studio-nt-close"
                  aria-label="Cerrar panel de navegación"
                  onClick={() => setNotchOpen(false)}
                >
                  <CloseIcon size={14} />
                </button>
              </div>

              <div className="studio-nt-main">
                <div className="studio-nt-clock">
                  <p className="studio-nt-time">{localTime}</p>
                  <p className="studio-nt-where">
                    {personalProfile.location} · {personalProfile.timeZoneLabel}
                  </p>
                  <p className="studio-nt-status">
                    <span>{personalProfile.hero.label} · Disponible</span>
                  </p>
                </div>

                <div className="studio-nt-pills">
                  <a
                    href="#proyectos"
                    className="studio-nt-pill studio-nt-go"
                    onClick={() => setNotchOpen(false)}
                  >
                    <span>Explorar proyectos</span>
                    <ArrowUpRightIcon size={14} />
                  </a>
                  <a
                    href="#contacto"
                    className="studio-nt-pill"
                    onClick={() => setNotchOpen(false)}
                  >
                    <span>Contactar</span>
                    <ArrowUpRightIcon size={14} />
                  </a>
                  <div className="studio-nt-social-row">
                    <a
                      href={personalProfile.contact.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio-nt-mini-link"
                    >
                      <GitHubIcon size={13} />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={personalProfile.contact.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio-nt-mini-link"
                    >
                      <LinkedInIcon size={13} />
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sistema de Cursor Dual Global */}
      {!calmMode && (
        <>
          <span
            ref={dotRef}
            className={`studio-cursor-dot ${
              cursorVisible && !cursorLabel ? 'is-on' : ''
            }`}
            aria-hidden="true"
          />
          <div
            ref={pillRef}
            className={`studio-visit-cursor ${
              cursorVisible && cursorLabel ? 'is-on' : ''
            }`}
            aria-hidden="true"
          >
            <span className="studio-visit-pill">
              <span>{cursorLabel ?? ''}</span>
            </span>
          </div>
        </>
      )}
    </>
  );
};
