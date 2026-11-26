import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { DisplayModeProvider, useDisplayMode } from './context/DisplayModeContext';
import { CookieConsentProvider, useCookieConsent } from './context/CookieConsentContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { Hero } from './sections/Hero';
import { About } from './sections/About';
import { Technologies } from './sections/Technologies';
import { Projects } from './sections/Projects';
import { Contact } from './sections/Contact';

const LegalPage = lazy(() =>
  import('./components/LegalPages').then((m) => ({ default: m.LegalPage }))
);

const AppShell: React.FC = () => {
  const { calmMode, liteMode } = useDisplayMode();
  const { currentPath } = useCookieConsent();
  const progressRef = useRef<HTMLDivElement | null>(null);
  const [osReducedMotion, setOsReducedMotion] = useState<boolean>(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setOsReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    const disableMotion = calmMode || osReducedMotion;

    document.documentElement.dataset.calmMode = disableMotion ? 'true' : 'false';
    document.documentElement.dataset.liteMode = liteMode ? 'true' : 'false';

    let progressRafPending = false;
    const renderProgress = () => {
      progressRafPending = false;
      const bar = progressRef.current;
      if (!bar) return;
      if (currentPath !== '/') {
        bar.style.transform = 'scaleX(0)';
        return;
      }
      const doc = document.documentElement;
      const maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const ratio = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    };

    const scheduleProgress = () => {
      if (progressRafPending) return;
      progressRafPending = true;
      window.requestAnimationFrame(renderProgress);
    };

    renderProgress();
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress, { passive: true });

    if (currentPath !== '/') {
      return () => {
        window.removeEventListener('scroll', scheduleProgress);
        window.removeEventListener('resize', scheduleProgress);
      };
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>('.sp-reveal'));
    if (disableMotion || typeof IntersectionObserver === 'undefined') {
      targets.forEach((el) => el.setAttribute('data-seen', 'true'));
      return () => {
        window.removeEventListener('scroll', scheduleProgress);
        window.removeEventListener('resize', scheduleProgress);
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute('data-seen', 'true');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
    );

    targets.forEach((el) => {
      if (el.getAttribute('data-seen') !== 'true') {
        observer.observe(el);
      }
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scheduleProgress);
      window.removeEventListener('resize', scheduleProgress);
    };
  }, [calmMode, liteMode, osReducedMotion, currentPath]);

  return (
    <div
      className={`sp-app-root ${calmMode || osReducedMotion ? 'is-calm' : ''} ${
        liteMode ? 'is-lite' : ''
      }`}
    >
      <a href="#contenido-principal" className="studio-skip-link">
        Saltar al contenido principal
      </a>

      <div className="sp-scroll-progress-wrap" aria-hidden="true">
        <div ref={progressRef} className="sp-scroll-progress-bar" />
      </div>

      <Navbar />

      <main id="contenido-principal" className="sp-main-layer">
        {currentPath === '/privacidad' || currentPath === '/cookies' ? (
          <Suspense
            fallback={
              <section className="studio-legal-page" aria-busy="true">
                <div className="sp-container studio-legal-container">
                  <p className="sp-eyebrow">Cargando documento legal…</p>
                </div>
              </section>
            }
          >
            <LegalPage path={currentPath} />
          </Suspense>
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
