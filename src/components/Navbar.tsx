import React, { useState, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from './GFLogo';
import {
  SunIcon,
  MoonIcon,
  ArrowUpRightIcon,
  ClockIcon,
  MenuIcon,
  CloseIcon,
} from './Icons';
import type { ThemeMode } from '../App';

interface NavbarProps {
  activeSection: string;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

const LiveClock: React.FC = memo(() => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat('es-AR', {
          timeZone: personalProfile.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setTime(formatter.format(new Date()));
      } catch {
        setTime('GMT-3');
      }
    };

    updateTime();
    const interval = window.setInterval(updateTime, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div
      className="navbar-clock-badge"
      title={`Hora local de Buenos Aires (${personalProfile.timeZone})`}
      aria-label={`Hora actual: ${time} ${personalProfile.timeZoneLabel}`}
    >
      <span className="clock-beacon-dot" aria-hidden="true" />
      <ClockIcon size={12} />
      <span className="tabular-nums">{time || '18:30:00'}</span>
      <span className="clock-zone-tag">{personalProfile.timeZoneLabel}</span>
    </div>
  );
});
LiveClock.displayName = 'LiveClock';

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  theme,
  onToggleTheme,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'sobre-mi', label: 'Sobre mí' },
    { id: 'proyectos', label: 'Proyectos' },
    { id: 'capacidades', label: 'Capacidades' },
    { id: 'tecnologias', label: 'Stack' },
    { id: 'faq', label: 'Preguntas' },
    { id: 'contacto', label: 'Contacto' },
  ];

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && menuOpen) setMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <header className={`brikken-top-bar ${scrolled ? 'is-scrolled' : ''}`} role="banner">
      <div className="brikken-container">
        <div className="brikken-nav-flex">
          {/* Esquina superior izquierda: Monograma Personal GF */}
          <div className="navbar-logo-slot">
            <GFLogo size={36} showSubtitle={true} />
          </div>

          {/* Navegación central estilo Brikken */}
          <nav className="navbar-center-links" aria-label="Navegación principal">
            {navLinks.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className={`nav-brikken-link ${isActive ? 'is-active' : ''}`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

          {/* Esquina superior derecha: Reloj, selector de tema y CTA directo */}
          <div className="navbar-right-slot">
            <LiveClock />

            <button
              type="button"
              className="navbar-theme-button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Cambiar a modo marfil cálido' : 'Cambiar a modo bosque oscuro'}
              title={theme === 'dark' ? 'Modo Marfil Cálido' : 'Modo Bosque Oscuro'}
            >
              {theme === 'dark' ? <SunIcon size={15} /> : <MoonIcon size={15} />}
            </button>

            <a href="#contacto" className="navbar-brikken-cta-btn">
              <span>CONTACTAR</span>
              <ArrowUpRightIcon size={12} />
            </a>

            {/* Botón hamburguesa móvil */}
            <button
              type="button"
              className="navbar-burger-button"
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-controls="brikken-mobile-menu"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {menuOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Drawer Móvil portaleado a document.body para evitar containing block de backdrop-filter */}
      {menuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="brikken-mobile-menu"
            className="brikken-mobile-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Navegación móvil"
          >
            <div className="mobile-panel-top">
              <GFLogo size={32} showSubtitle={true} />
            </div>

            <div className="mobile-panel-links">
              {navLinks.map((item, idx) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className={`mobile-panel-link ${isActive ? 'is-active' : ''}`}
                    onClick={closeMenu}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="link-label">{item.label}</span>
                    <span className="link-num tabular-nums">0{idx}</span>
                  </a>
                );
              })}
            </div>

            <div className="mobile-panel-bottom">
              <p className="mobile-meta-text">
                {personalProfile.name} · {personalProfile.roleTag}
              </p>
              <a
                href={`mailto:${personalProfile.contact.email}`}
                className="navbar-brikken-cta-btn"
                onClick={closeMenu}
                style={{ justifyContent: 'center' }}
              >
                <span>ESCRIBIR CORREO</span>
                <ArrowUpRightIcon size={13} />
              </a>
            </div>
          </div>,
          document.body
        )}
    </header>
  );
};

export default Navbar;
