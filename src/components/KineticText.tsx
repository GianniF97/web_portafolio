import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';

interface KineticWordProps {
  text: string;
  className?: string;
}

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz';

/**
 * Palabra clave interactiva con estabilización sutil de caracteres al pasar el cursor
 * o al entrar en escena. Se desactiva por completo en Modo Calmo o prefers-reduced-motion.
 */
export const KineticWord: React.FC<KineticWordProps> = ({ text, className = '' }) => {
  const { calmMode, liteMode } = useDisplayMode();
  const [displayText, setDisplayText] = useState(text);
  const rafRef = useRef<number | null>(null);
  const hasPlayedInitialRef = useRef(false);

  const runStabilize = useCallback(() => {
    if (calmMode || liteMode) {
      setDisplayText(text);
      return;
    }

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
    }

    const duration = 260;
    const start = performance.now();
    const chars = text.split('');

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const lockedCount = Math.floor(progress * chars.length);

      const next = chars
        .map((char, idx) => {
          if (char === ' ') return ' ';
          if (idx < lockedCount || progress >= 1) return char;
          const randomGlyph = GLYPHS[(Math.floor(now / 32) + idx * 7) % GLYPHS.length];
          return char === char.toUpperCase() ? randomGlyph.toUpperCase() : randomGlyph;
        })
        .join('');

      setDisplayText(next);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplayText(text);
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(step);
  }, [calmMode, liteMode, text]);

  useEffect(() => {
    if (calmMode || liteMode) {
      setDisplayText(text);
      return;
    }

    if (!hasPlayedInitialRef.current) {
      hasPlayedInitialRef.current = true;
      const timer = window.setTimeout(runStabilize, 120);
      return () => window.clearTimeout(timer);
    }
  }, [calmMode, liteMode, runStabilize, text]);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <span
      className={`wow-kinetic-word ${className}`}
      onMouseEnter={runStabilize}
      onFocus={runStabilize}
      tabIndex={0}
      aria-label={text}
    >
      <span aria-hidden="true">{displayText}</span>
    </span>
  );
};
