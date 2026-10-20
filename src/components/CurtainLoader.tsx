import React, { useState, useEffect, memo } from 'react';
import { GFLogo } from './GFLogo';

interface CurtainLoaderProps {
  onComplete?: () => void;
}

/**
 * Animación de entrada inicial de Brikken+Co:
 * - Telón dividido en dos mitades horizontales (superior e inferior).
 * - Monograma GF central con wipe de revelación progresiva.
 * - Deslizamiento suave de apertura vertical que revela la página.
 */
export const CurtainLoader: React.FC<CurtainLoaderProps> = memo(({ onComplete }) => {
  const [phase, setPhase] = useState<'loading' | 'opening' | 'finished'>('loading');

  useEffect(() => {
    // Si el usuario prefiere movimiento reducido, omitir animación
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('finished');
      if (onComplete) onComplete();
      return;
    }

    // Fase 1: Revelación del monograma
    const t1 = setTimeout(() => {
      setPhase('opening');
    }, 800);

    // Fase 2: Apertura completa del telón y fin
    const t2 = setTimeout(() => {
      setPhase('finished');
      if (onComplete) onComplete();
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onComplete]);

  if (phase === 'finished') {
    return null;
  }

  const isOpening = phase === 'opening';

  return (
    <div
      className={`brikken-curtain-container ${isOpening ? 'is-opening' : ''}`}
      aria-hidden="true"
    >
      {/* Mitad Superior del Telón */}
      <div className={`curtain-half curtain-top ${isOpening ? 'slide-up' : ''}`} />

      {/* Mitad Inferior del Telón */}
      <div className={`curtain-half curtain-bottom ${isOpening ? 'slide-down' : ''}`} />

      {/* Monograma Central con Wipe */}
      <div className={`curtain-center-brand ${isOpening ? 'fade-out' : ''}`}>
        <div className="curtain-logo-wrap">
          <GFLogo size={56} showSubtitle={false} />
        </div>
        <div className="curtain-loader-bar">
          <div className="curtain-loader-fill" />
        </div>
      </div>
    </div>
  );
});

CurtainLoader.displayName = 'CurtainLoader';

export default CurtainLoader;
