import React, { useState, useEffect, useCallback } from 'react';
import { CurtainLoader } from './components/CurtainLoader';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Projects } from './sections/Projects';
import { ServicesSticky } from './sections/ServicesSticky';
import { Technologies } from './sections/Technologies';
import { FaqSection } from './sections/FaqSection';
import { Contact } from './sections/Contact';
import { personalProfile } from './data/portfolioData';

export type ThemeMode = 'dark' | 'light';

export const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('inicio');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      // Limpiar claves antiguas que forzaban modo oscuro en sesiones previas
      window.localStorage.removeItem('gf-portfolio-theme');
      const saved = window.localStorage.getItem('gf-theme-brikken');
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    }
    return 'light'; // Por defecto absoluto: paleta Marfil (#F4F1E8) y verdes de referencia
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('gf-theme-brikken', theme);
    } catch {
      // Ignorar si localStorage está restringido
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    if (personalProfile.canonicalSiteUrl) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = personalProfile.canonicalSiteUrl;
    }
  }, []);

  useEffect(() => {
    const sectionIds = [
      'inicio',
      'sobre-mi',
      'proyectos',
      'capacidades',
      'tecnologias',
      'faq',
      'contacto',
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: 0.05,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      document.documentElement.removeAttribute('data-scroll-observer');
      document.querySelectorAll('.reveal-section, .reveal-card').forEach((el) => {
        el.classList.add('is-visible');
      });
      return () => observer.disconnect();
    }

    document.documentElement.setAttribute('data-scroll-observer', 'ready');

    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.05,
      }
    );

    const targets = document.querySelectorAll(
      '.reveal-section:not(.is-visible), .reveal-card:not(.is-visible)'
    );
    targets.forEach((el) => revealObserver.observe(el));

    return () => {
      observer.disconnect();
      revealObserver.disconnect();
    };
  }, []);

  return (
    <div className="brikken-app-shell">
      {/* Telón animado inicial de entrada estilo Brikken+Co */}
      <CurtainLoader />

      {/* Grilla visual arquitectónica de 4 columnas (brikken structural grid) */}
      <div className="brikken-structural-grid" aria-hidden="true">
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
        <div className="grid-line" />
      </div>

      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Navegación superior con Monograma GF en la esquina superior izquierda */}
      <Navbar
        activeSection={activeSection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Contenido principal en la secuencia arquitectónica de Brikken+Co */}
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <About />
        <Projects />
        <ServicesSticky />
        <Technologies />
        <FaqSection />
        <Contact />
      </main>

      {/* Pie de página con firma monumental */}
      <Footer />
    </div>
  );
};

export default App;
