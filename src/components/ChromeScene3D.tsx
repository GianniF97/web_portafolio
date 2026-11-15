import React, { useEffect, useRef } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';

interface ChromeScene3DProps {
  className?: string;
}

interface MeshNode {
  bx: number;
  by: number;
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  light: number;
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function getElevation(nx: number, ny: number, phase: number, scrollPhase: number): number {
  const waveA = Math.sin(nx * 4.4 + phase * 0.72 + scrollPhase * 1.15);
  const waveB = Math.cos(ny * 3.6 - phase * 0.54 + Math.sin(nx * 2.1 + phase * 0.35));
  const ridge = Math.sin((nx * 2.8 + ny * 2.2) * 1.7 + phase * 0.4 + scrollPhase * 0.7);
  return (waveA * 0.45 + waveB * 0.35 + ridge * 0.2) * 18;
}

export const ChromeScene3D: React.FC<ChromeScene3DProps> = ({ className = '' }) => {
  const { calmMode, liteMode } = useDisplayMode();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const mediaQuery =
      typeof window !== 'undefined' && typeof window.matchMedia === 'function'
        ? window.matchMedia('(prefers-reduced-motion: reduce)')
        : null;

    let systemReducedMotion = mediaQuery ? mediaQuery.matches : false;
    const shouldAnimate = () => !calmMode && !liteMode && !systemReducedMotion;

    let width = Math.max(container.clientWidth, 1);
    let height = Math.max(container.clientHeight, 1);
    let dpr = clamp(window.devicePixelRatio || 1, 1, 2);

    let cols = 0;
    let rows = 0;
    let nodes: MeshNode[] = [];

    const pointer = {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: false,
      strength: 0,
      targetStrength: 0,
    };

    let currentScrollY = window.scrollY || 0;
    let smoothScrollY = currentScrollY;
    let timePhase = 0;
    let lastTs = performance.now();
    let rafId: number | null = null;
    let isTabVisible = typeof document === 'undefined' ? true : !document.hidden;
    let isInViewport = true;

    const buildGrid = () => {
      width = Math.max(container.clientWidth, 1);
      height = Math.max(container.clientHeight, 1);
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const spacing = width < 640 ? 48 : width < 1024 ? 50 : 46;
      cols = Math.max(8, Math.ceil(width / spacing) + 3);
      rows = Math.max(6, Math.ceil(height / spacing) + 3);

      const startX = (width - (cols - 1) * spacing) * 0.5;
      const startY = (height - (rows - 1) * spacing) * 0.5;

      const nextNodes: MeshNode[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const stagger = r % 2 === 1 ? spacing * 0.25 : 0;
          nextNodes.push({
            bx: startX + c * spacing + stagger,
            by: startY + r * spacing,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            light: 0,
          });
        }
      }
      nodes = nextNodes;
    };

    const drawFrame = (dtSec: number, animated: boolean) => {
      if (animated) {
        timePhase += dtSec * 0.7;
      }

      smoothScrollY += (currentScrollY - smoothScrollY) * (animated ? 0.09 : 1);
      const scrollNorm = smoothScrollY / Math.max(height, 1);
      const scrollPhase = scrollNorm * 1.45;
      const parallaxY = -scrollNorm * 28;

      pointer.strength += (pointer.targetStrength - pointer.strength) * (animated ? 0.085 : 1);
      if (pointer.active) {
        pointer.x += (pointer.targetX - pointer.x) * (animated ? 0.16 : 1);
        pointer.y += (pointer.targetY - pointer.y) * (animated ? 0.16 : 1);
      }

      const influenceRadius = width < 640 ? 165 : 230;
      const radiusSq = influenceRadius * influenceRadius;
      const centerX = width * 0.5;
      const centerY = height * 0.47;
      const maskRx = Math.max(width * 0.3, 180);
      const maskRy = Math.max(height * 0.3, 170);

      const computedX = new Float32Array(nodes.length);
      const computedY = new Float32Array(nodes.length);
      const computedFade = new Float32Array(nodes.length);
      const computedElevation = new Float32Array(nodes.length);

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const nx = node.bx / Math.max(width, 1);
        const ny = node.by / Math.max(height, 1);
        const elev = getElevation(nx, ny, timePhase, scrollPhase);

        let targetOx = 0;
        let targetOy = elev + (parallaxY * (0.45 + ny * 0.55));
        let targetLight = 0;

        if (pointer.strength > 0.01) {
          const dx = node.bx - pointer.x;
          const dy = node.by + targetOy - pointer.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < radiusSq && distSq > 0.001) {
            const dist = Math.sqrt(distSq);
            const falloff = 1 - dist / influenceRadius;
            const eased = falloff * falloff;
            const ripple = Math.sin(dist * 0.045 - timePhase * 3.2) * 0.25 + 0.75;
            const push = eased * 24 * pointer.strength * ripple;
            targetOx += (dx / dist) * push;
            targetOy += (dy / dist) * push;
            targetLight = eased * pointer.strength;
          }
        }

        if (animated) {
          node.vx = (node.vx + (targetOx - node.ox) * 0.085) * 0.86;
          node.vy = (node.vy + (targetOy - node.oy) * 0.085) * 0.86;
          node.ox += node.vx;
          node.oy += node.vy;
          node.light += (targetLight - node.light) * 0.14;
        } else {
          node.ox = targetOx;
          node.oy = targetOy;
          node.light = 0;
        }

        const px = node.bx + node.ox;
        const py = node.by + node.oy;
        computedX[i] = px;
        computedY[i] = py;
        computedElevation[i] = elev;

        const ex = (px - centerX) / maskRx;
        const ey = (py - centerY) / maskRy;
        const centerDist = Math.sqrt(ex * ex + ey * ey);
        // Atenuación central suave para preservar legibilidad máxima de GF y GIANNI FERRARI
        computedFade[i] = clamp(0.24 + clamp(centerDist, 0, 1.35) * 0.58, 0.22, 1);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      // Líneas horizontales de curva topográfica
      ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const i1 = r * cols + c;
          const i2 = i1 + 1;
          const fade = (computedFade[i1] + computedFade[i2]) * 0.5;
          const glow = Math.max(nodes[i1].light, nodes[i2].light);
          const ridgeBoost = clamp((computedElevation[i1] + 18) / 36, 0, 1);

          const alpha = clamp((0.16 + ridgeBoost * 0.16 + glow * 0.52) * fade, 0.03, 0.82);
          if (glow > 0.18) {
            ctx.strokeStyle = `rgba(103, 232, 249, ${alpha.toFixed(3)})`;
          } else {
            ctx.strokeStyle = `rgba(226, 232, 240, ${alpha.toFixed(3)})`;
          }

          ctx.beginPath();
          ctx.moveTo(computedX[i1], computedY[i1]);
          ctx.lineTo(computedX[i2], computedY[i2]);
          ctx.stroke();
        }
      }

      // Vectores estructurales verticales y diagonales en zonas activas o crestas
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols; c++) {
          const i1 = r * cols + c;
          const iDown = i1 + cols;
          const fade = (computedFade[i1] + computedFade[iDown]) * 0.5;
          const glow = Math.max(nodes[i1].light, nodes[iDown].light);

          if (c % 2 === 0 || glow > 0.12) {
            const vAlpha = clamp((0.08 + glow * 0.45) * fade, 0.02, 0.68);
            ctx.strokeStyle =
              glow > 0.22
                ? `rgba(103, 232, 249, ${vAlpha.toFixed(3)})`
                : `rgba(148, 163, 184, ${vAlpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(computedX[i1], computedY[i1]);
            ctx.lineTo(computedX[iDown], computedY[iDown]);
            ctx.stroke();
          }
        }
      }

      // Puntos nodales minimalistas en intersecciones
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const fade = computedFade[i];
        const dotAlpha = clamp((0.28 + node.light * 0.65) * fade, 0.06, 0.92);
        const radius = 1.15 + node.light * 1.45;

        ctx.fillStyle =
          node.light > 0.2
            ? `rgba(165, 243, 252, ${dotAlpha.toFixed(3)})`
            : `rgba(226, 232, 240, ${dotAlpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(computedX[i], computedY[i], radius, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const stopLoop = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    const tick = (now: number) => {
      if (!shouldAnimate() || !isTabVisible || !isInViewport) {
        rafId = null;
        return;
      }
      const dt = Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      drawFrame(dt, true);
      rafId = requestAnimationFrame(tick);
    };

    const startOrRenderStatic = () => {
      stopLoop();
      if (!shouldAnimate()) {
        drawFrame(0, false);
        return;
      }
      if (isTabVisible && isInViewport) {
        lastTs = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const localX = clientX - rect.left;
      const localY = clientY - rect.top;
      const inside = localX >= -60 && localX <= rect.width + 60 && localY >= -60 && localY <= rect.height + 60;
      if (inside) {
        pointer.targetX = localX;
        pointer.targetY = localY;
        pointer.active = true;
        pointer.targetStrength = 1;
      } else {
        pointer.targetStrength = 0;
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePointerFromClient(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      pointer.targetStrength = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updatePointerFromClient(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      pointer.targetStrength = 0;
    };

    const handleScroll = () => {
      currentScrollY = window.scrollY || 0;
      if (!shouldAnimate()) {
        drawFrame(0, false);
      }
    };

    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        startOrRenderStatic();
      } else {
        stopLoop();
      }
    };

    const handleResize = () => {
      buildGrid();
      drawFrame(0, false);
    };

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      systemReducedMotion = e.matches;
      startOrRenderStatic();
    };

    let intersectionObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          isInViewport = entry ? entry.isIntersecting : true;
          if (isInViewport) {
            startOrRenderStatic();
          } else {
            stopLoop();
          }
        },
        { threshold: 0.01 }
      );
      intersectionObserver.observe(container);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    buildGrid();
    drawFrame(0, false);
    startOrRenderStatic();

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (mediaQuery) {
      mediaQuery.addEventListener('change', handleMotionPreference);
    }

    return () => {
      stopLoop();
      intersectionObserver?.disconnect();
      resizeObserver?.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (mediaQuery) {
        mediaQuery.removeEventListener('change', handleMotionPreference);
      }
    };
  }, [calmMode, liteMode]);

  return (
    <div ref={containerRef} className={`studio-scene-container ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="studio-three-canvas" />
    </div>
  );
};
