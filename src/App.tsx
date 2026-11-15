import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DisplayModeProvider, useDisplayMode } from './context/DisplayModeContext';
import { CookieConsentProvider, useCookieConsent } from './context/CookieConsentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LegalPage } from './components/LegalPages';
import { CookieConsent } from './components/CookieConsent';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Technologies } from './sections/Technologies';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';

gsap.registerPlugin(ScrollTrigger);

const AppShell: React.FC = () => {
  const { calmMode, liteMode } = useDisplayMode();
  const { currentPath } = useCookieConsent();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const disableMotion = calmMode || prefersReducedMotion;

    document.documentElement.dataset.calmMode = disableMotion ? 'true' : 'false';
    document.documentElement.dataset.liteMode = liteMode ? 'true' : 'false';
    if (disableMotion) {
      document.documentElement.setAttribute('data-still', 'true');
      document.documentElement.setAttribute('data-access', 'true');
    } else {
      document.documentElement.removeAttribute('data-still');
      document.documentElement.removeAttribute('data-access');
    }

    if (liteMode) {
      document.documentElement.setAttribute('data-lite', 'true');
    } else {
      document.documentElement.removeAttribute('data-lite');
    }

    if (currentPath !== '/') {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      if (progressRef.current) {
        progressRef.current.style.transform = 'scaleX(0)';
      }
      return;
    }

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>('.studio-section, .studio-pj, .studio-fq-item')
    );

    if (disableMotion) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      revealTargets.forEach((el) => el.setAttribute('data-seen', 'true'));
      if (progressRef.current) {
        progressRef.current.style.transform = 'scaleX(0)';
      }
      return;
    }

    // Observer dedicado para disparar revelados CSS estilo wowww.art ([data-seen="true"])
    let observer: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              (entry.target as HTMLElement).setAttribute('data-seen', 'true');
              observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -8% 0px' }
      );
      revealTargets.forEach((el) => observer?.observe(el));
    } else {
      revealTargets.forEach((el) => el.setAttribute('data-seen', 'true'));
    }

    const ctx = gsap.context(() => {
      // 1. Barra superior de progreso
      if (progressRef.current) {
        gsap.fromTo(
          progressRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: document.documentElement,
              start: 'top top',
              end: 'bottom bottom',
              scrub: 0.2,
            },
          }
        );
      }

      // 2. Parallax vertical sutil de profundidad en la capa WebGL 3D del Hero
      const webglLayer = document.querySelector('.studio-hero-webgl-layer');
      if (webglLayer && !liteMode) {
        gsap.to(webglLayer, {
          yPercent: 18,
          scale: 1.06,
          ease: 'none',
          scrollTrigger: {
            trigger: '.studio-hero-stage',
            start: 'top top',
            end: 'bottom top',
            scrub: 0.4,
          },
        });
      }

      // 3. Rotación especular 3D vinculada al scroll sobre "SELLO GF" dentro de .studio-story
      const chromeWord = document.querySelector('.studio-chrome-extrude');
      if (chromeWord) {
        gsap.fromTo(
          chromeWord,
          { rotateX: 28, rotateY: -18, scale: 0.88 },
          {
            rotateX: 0,
            rotateY: 10,
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.studio-story',
              start: '35% top',
              end: '82% bottom',
              scrub: 0.45,
            },
          }
        );
      }

      // 4. Entrada de la arena de tecnologías y las columnas
      const techArena = document.querySelector('.studio-sv-pile');
      if (techArena) {
        gsap.fromTo(
          techArena,
          { y: 36, scale: 0.97, opacity: 0.4 },
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.85,
            ease: 'power3.out',
            clearProps: 'transform,opacity',
            scrollTrigger: {
              trigger: techArena,
              start: 'top 88%',
              once: true,
            },
          }
        );
      }

      // 5. Barrido progresivo de .studio-sv-wow en tecnologías y proyectos
      const wowTexts = gsap.utils.toArray<HTMLElement>('.studio-sv-wow');
      wowTexts.forEach((word) => {
        gsap.fromTo(
          word,
          { backgroundPosition: '0% 0%' },
          {
            backgroundPosition: '100% 0%',
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: word,
              start: 'top 88%',
              once: true,
            },
          }
        );
      });
    }, rootRef);

    const refreshId = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 180);

    return () => {
      window.clearTimeout(refreshId);
      observer?.disconnect();
      ctx.revert();
    };
  }, [calmMode, liteMode, currentPath]);

  return (
    <div
      ref={rootRef}
      className={`studio-app-root ${calmMode ? 'studio-calm-mode' : ''} ${
        liteMode ? 'studio-lite-mode' : ''
      }`}
    >
      <a href="#contenido-principal" className="studio-skip-link">
        Saltar al contenido principal
      </a>

      <div className="studio-scroll-progress-wrap" aria-hidden="true">
        <div ref={progressRef} className="studio-scroll-progress-bar" />
      </div>

      <Navbar />

      <main id="contenido-principal">
        {currentPath === '/privacidad' || currentPath === '/cookies' ? (
          <LegalPage path={currentPath} />
        ) : (
          <>
            <Hero />
            <About />
            <Technologies />
            <Projects />
            <Contact />
          </>
        )}
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <DisplayModeProvider>
      <CookieConsentProvider>
        <AppShell />
      </CookieConsentProvider>
    </DisplayModeProvider>
  );
};

export default App;
