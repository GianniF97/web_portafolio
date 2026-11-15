import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export type AppRoutePath = '/' | '/privacidad' | '/cookies';

export interface CookieConsentState {
  necessary: true;
  preferences: boolean;
  analytics: boolean;
  updatedAt: string;
}

interface CookieConsentContextValue {
  consent: CookieConsentState;
  hasResponded: boolean;
  isBannerVisible: boolean;
  isConfigOpen: boolean;
  currentPath: AppRoutePath;
  acceptAll: () => void;
  acceptNecessaryOnly: () => void;
  savePreferences: (opts: { preferences: boolean; analytics: boolean }) => void;
  openConfig: () => void;
  closeConfig: () => void;
  navigateTo: (path: AppRoutePath, hash?: string) => void;
}

export const CONSENT_STORAGE_KEY = 'gf-cookie-consent-v1';
export const CALM_STORAGE_KEY = 'gf-studio-calm-mode';
export const LITE_STORAGE_KEY = 'gf-studio-lite-mode';
export const CONSENT_UPDATED_EVENT = 'gf-consent-updated';

const BASE_DOCUMENT_TITLE = 'Gianni Ferrari · Analista de Sistemas | Portfolio';

const DEFAULT_CONSENT: CookieConsentState = {
  necessary: true,
  preferences: true,
  analytics: false,
  updatedAt: '',
};

function normalizePath(pathname: string): AppRoutePath {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/privacidad') return '/privacidad';
  if (clean === '/cookies') return '/cookies';
  return '/';
}

function readStoredConsent(): { consent: CookieConsentState; hasResponded: boolean } {
  if (typeof window === 'undefined') {
    return { consent: DEFAULT_CONSENT, hasResponded: false };
  }
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { consent: DEFAULT_CONSENT, hasResponded: false };
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      typeof parsed.preferences === 'boolean' &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.updatedAt === 'string' &&
      parsed.updatedAt.length > 0
    ) {
      return {
        consent: {
          necessary: true,
          preferences: parsed.preferences,
          analytics: parsed.analytics,
          updatedAt: parsed.updatedAt,
        },
        hasResponded: true,
      };
    }
  } catch {
    // Ignorar errores de parseo o acceso restringido a localStorage
  }
  return { consent: DEFAULT_CONSENT, hasResponded: false };
}

export function canPersistPreferencesStorage(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw) as Partial<CookieConsentState>;
    if (typeof parsed?.preferences === 'boolean') {
      return parsed.preferences;
    }
  } catch {
    return false;
  }
  return true;
}

const CookieConsentContext = createContext<CookieConsentContextValue>({
  consent: DEFAULT_CONSENT,
  hasResponded: false,
  isBannerVisible: true,
  isConfigOpen: false,
  currentPath: '/',
  acceptAll: () => {},
  acceptNecessaryOnly: () => {},
  savePreferences: () => {},
  openConfig: () => {},
  closeConfig: () => {},
  navigateTo: () => {},
});

export const CookieConsentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stored] = useState(() => readStoredConsent());
  const [consent, setConsent] = useState<CookieConsentState>(stored.consent);
  const [hasResponded, setHasResponded] = useState<boolean>(stored.hasResponded);
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [currentPath, setCurrentPath] = useState<AppRoutePath>(() =>
    typeof window !== 'undefined' ? normalizePath(window.location.pathname) : '/'
  );

  const persistConsent = useCallback((next: CookieConsentState) => {
    setConsent(next);
    setHasResponded(true);
    setIsConfigOpen(false);
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(next));
      if (!next.preferences) {
        window.localStorage.removeItem(CALM_STORAGE_KEY);
        window.localStorage.removeItem(LITE_STORAGE_KEY);
      }
      window.dispatchEvent(new Event(CONSENT_UPDATED_EVENT));
    } catch {
      // Ignorar si localStorage está bloqueado
    }
  }, []);

  const acceptAll = useCallback(() => {
    persistConsent({
      necessary: true,
      preferences: true,
      analytics: true,
      updatedAt: new Date().toISOString(),
    });
  }, [persistConsent]);

  const acceptNecessaryOnly = useCallback(() => {
    persistConsent({
      necessary: true,
      preferences: false,
      analytics: false,
      updatedAt: new Date().toISOString(),
    });
  }, [persistConsent]);

  const savePreferences = useCallback(
    (opts: { preferences: boolean; analytics: boolean }) => {
      persistConsent({
        necessary: true,
        preferences: opts.preferences,
        analytics: opts.analytics,
        updatedAt: new Date().toISOString(),
      });
    },
    [persistConsent]
  );

  const openConfig = useCallback(() => {
    setIsConfigOpen(true);
  }, []);

  const closeConfig = useCallback(() => {
    setIsConfigOpen(false);
  }, []);

  const navigateTo = useCallback((path: AppRoutePath, hash?: string) => {
    const cleanHash = hash ? (hash.startsWith('#') ? hash : `#${hash}`) : '';
    const targetUrl = `${path}${cleanHash}`;

    if (typeof window !== 'undefined') {
      const currentFull = `${window.location.pathname}${window.location.hash}`;
      if (currentFull !== targetUrl) {
        window.history.pushState({}, '', targetUrl);
      }
    }

    setCurrentPath(path);

    if (typeof window !== 'undefined') {
      if (cleanHash) {
        window.setTimeout(() => {
          const el = document.querySelector(cleanHash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      if (!window.location.hash) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    if (currentPath === '/privacidad') {
      document.title = 'Política de Privacidad · Gianni Ferrari';
    } else if (currentPath === '/cookies') {
      document.title = 'Política de Cookies · Gianni Ferrari';
    } else {
      document.title = BASE_DOCUMENT_TITLE;
    }
  }, [currentPath]);

  const isBannerVisible = !hasResponded && !isConfigOpen;

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        hasResponded,
        isBannerVisible,
        isConfigOpen,
        currentPath,
        acceptAll,
        acceptNecessaryOnly,
        savePreferences,
        openConfig,
        closeConfig,
        navigateTo,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
};

export function useCookieConsent(): CookieConsentContextValue {
  return useContext(CookieConsentContext);
}
