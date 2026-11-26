import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  CALM_STORAGE_KEY,
  LITE_STORAGE_KEY,
  CONSENT_UPDATED_EVENT,
  canPersistPreferencesStorage,
} from './CookieConsentContext';

interface DisplayModeContextValue {
  calmMode: boolean;
  liteMode: boolean;
  toggleCalmMode: () => void;
  toggleLiteMode: () => void;
}

const DisplayModeContext = createContext<DisplayModeContextValue>({
  calmMode: false,
  liteMode: false,
  toggleCalmMode: () => {},
  toggleLiteMode: () => {},
});

/**
 * Proveedor de accesibilidad y rendimiento gráfico:
 * - calmMode: desactiva animaciones de scroll, tipografía cinética y física continua.
 * - liteMode: alternativa ligera para equipos de menor rendimiento.
 * - Responde dinámicamente a cambios del sistema operativo en prefers-reduced-motion.
 */
export const DisplayModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasExplicitCalm, setHasExplicitCalm] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage.getItem(CALM_STORAGE_KEY) !== null;
    } catch {
      return false;
    }
  });

  const [calmMode, setCalmMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = window.localStorage.getItem(CALM_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignorar si localStorage no está disponible
    }
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  const [liteMode, setLiteMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      const saved = window.localStorage.getItem(LITE_STORAGE_KEY);
      if (saved !== null) return saved === 'true';
    } catch {
      // Ignorar si localStorage no está disponible
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || hasExplicitCalm) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setCalmMode(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [hasExplicitCalm]);

  const syncStorage = useCallback((nextCalm: boolean, nextLite: boolean, explicit: boolean) => {
    try {
      if (canPersistPreferencesStorage()) {
        if (explicit) {
          window.localStorage.setItem(CALM_STORAGE_KEY, String(nextCalm));
        }
        window.localStorage.setItem(LITE_STORAGE_KEY, String(nextLite));
      } else {
        window.localStorage.removeItem(CALM_STORAGE_KEY);
        window.localStorage.removeItem(LITE_STORAGE_KEY);
      }
    } catch {
      // Ignorar si localStorage está restringido
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-calm-mode', calmMode ? 'true' : 'false');
    root.setAttribute('data-lite-mode', liteMode ? 'true' : 'false');
    syncStorage(calmMode, liteMode, hasExplicitCalm);
  }, [calmMode, liteMode, hasExplicitCalm, syncStorage]);

  useEffect(() => {
    const handleConsentChange = () => {
      syncStorage(calmMode, liteMode, hasExplicitCalm);
    };
    window.addEventListener(CONSENT_UPDATED_EVENT, handleConsentChange);
    return () => window.removeEventListener(CONSENT_UPDATED_EVENT, handleConsentChange);
  }, [calmMode, liteMode, hasExplicitCalm, syncStorage]);

  const toggleCalmMode = useCallback(() => {
    setHasExplicitCalm(true);
    setCalmMode((prev) => !prev);
  }, []);

  const toggleLiteMode = useCallback(() => {
    setLiteMode((prev) => !prev);
  }, []);

  return (
    <DisplayModeContext.Provider value={{ calmMode, liteMode, toggleCalmMode, toggleLiteMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
};

export function useDisplayMode(): DisplayModeContextValue {
  return useContext(DisplayModeContext);
}
