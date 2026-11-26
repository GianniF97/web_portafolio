import React, { useEffect, useState } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';
import { useCookieConsent } from '../context/CookieConsentContext';
import { personalProfile } from '../data/portfolioData';
import { GFLogo } from './GFLogo';
import { ArrowUpRightIcon, CloseIcon, GitHubIcon, LinkedInIcon, MenuIcon } from './Icons';

const NAV_ITEMS = [
  { id: 'inicio', href: '#inicio', label: 'Inicio' },
  { id: 'sobre-mi', href: '#sobre-mi', label: 'Sobre mí' },
  { id: 'tecnologias', href: '#tecnologias', label: 'Stack' },
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
  const { currentPath, navigateTo } = useCookieConsent();
  const [activeId, setActiveId] = useState<string>('inicio');
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [localTime, setLocalTime] = useState<string>(() => getArgentinaTime());

  useEffect(() => {
    const timer = window.setInterval(() => setLocalTime(getArgentinaTime()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (currentPath !== '/') return;

    const sectionIds = NAV_ITEMS.map((item) => item.id);
    let rafPending = false;

    const computeActiveSection = () => {
      rafPending = false;
      const elements = sectionIds
        .map((id) => document.getElementById(id))
        .filter((el): el is HTMLElement => Boolean(el));

      if (!elements.length) return;

      const scrollTop = window.scrollY;
      const viewportH = window.innerHeight;
      const docH = document.documentElement.scrollHeight;

      if (scrollTop < 48) {
        setActiveId('inicio');
        return;
      }

      if (scrollTop + viewportH >= docH - 24) {
        setActiveId(elements[elements.length - 1].id);
        return;
      }

      const triggerY = Math.max(132, Math.min(viewportH * 0.3, 260));
      let current = elements[0].id;

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= triggerY) {
          current = el.id;
        } else {
          break;
        }
      }

      setActiveId(current);
    };

    const scheduleCompute = () => {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(computeActiveSection);
    };

    computeActiveSection();
    window.addEventListener('scroll', scheduleCompute, { passive: true });
    window.addEventListener('resize', scheduleCompute, { passive: true });
    window.addEventListener('hashchange', scheduleCompute);

    return () => {
      window.removeEventListener('scroll', scheduleCompute);
      window.removeEventListener('resize', scheduleCompute);
      window.removeEventListener('hashchange', scheduleCompute);
    };
  }, [currentPath]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    setMobileOpen(false);
    setActiveId(id);
    if (currentPath !== '/') {
      e.preventDefault();
      navigateTo('/', href);
    }
  };

  return (
    <header className={`sp-navbar-wrap ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="sp-container">
        <nav className="sp-navbar" aria-label="Navegación principal">
          <a
            href="#inicio"
            className="sp-brand"
            onClick={(e) => handleNavClick(e, '#inicio', 'inicio')}
            aria-label={`${personalProfile.name} — Volver al inicio`}
          >
            <GFLogo variant="navbar" showSubtitle={false} size={32} />
            <span className="sp-brand-name">{personalProfile.brandMark}</span>
          </a>

          <ul className="sp-nav-links">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPath === '/' && activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className={`sp-nav-link ${isActive ? 'is-active' : ''}`}
                    aria-current={isActive ? 'location' : undefined}
                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="sp-nav-actions">
            <span className="sp-nav-time" title="Hora local en Argentina">
              AR · {localTime}
            </span>

            <button
              type="button"
              className={`sp-motion-btn ${calmMode ? 'is-paused' : ''}`}
              onClick={toggleCalmMode}
              aria-pressed={calmMode}
              title={
                calmMode
                  ? 'Reanudar animaciones y cámara 3D'
                  : 'Reducir movimiento y pausar animación 3D'
              }
            >
              {calmMode ? '3D Pausado' : 'Movimiento 3D'}
            </button>

            <button
              type="button"
              className="sp-mobile-toggle"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-expanded={mobileOpen}
              aria-controls="sp-mobile-drawer"
              aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {mobileOpen ? <CloseIcon size={18} /> : <MenuIcon size={18} />}
            </button>
          </div>
        </nav>

        {mobileOpen && (
          <div id="sp-mobile-drawer" className="sp-mobile-drawer">
            <ul className="sp-mobile-links">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="sp-mobile-link"
                    onClick={(e) => handleNavClick(e, item.href, item.id)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="sp-mobile-controls">
              <button
                type="button"
                className="sp-mobile-control-btn"
                onClick={toggleCalmMode}
                aria-pressed={calmMode}
              >
                {calmMode ? 'Activar movimiento 3D' : 'Pausar animaciones 3D'}
              </button>
              <button
                type="button"
                className="sp-mobile-control-btn"
                onClick={toggleLiteMode}
                aria-pressed={liteMode}
              >
                {liteMode ? 'Gráficos estándar' : 'Modo ahorro gráfico'}
              </button>
            </div>

            <div className="sp-mobile-social">
              <a
                href={personalProfile.contact.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sp-inline-ext"
              >
                <GitHubIcon size={15} />
                <span>GitHub</span>
                <ArrowUpRightIcon size={13} />
              </a>
              <a
                href={personalProfile.contact.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sp-inline-ext"
              >
                <LinkedInIcon size={15} />
                <span>LinkedIn</span>
                <ArrowUpRightIcon size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
