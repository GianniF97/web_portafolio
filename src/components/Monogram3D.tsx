import React, { memo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useDisplayMode } from '../context/DisplayModeContext';

interface Monogram3DProps {
  className?: string;
}

const G_BASE_X = -1.68;
const F_BASE_X = 1.68;

function createLetterGShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Silueta geométrica pesada con leve inclinación editorial (+0.125 dx/dy)
  shape.moveTo(-1.45, -1.05);
  shape.lineTo(1.26, -1.05);
  shape.lineTo(1.41, 0.20);
  shape.lineTo(0.18, 0.20);
  shape.lineTo(0.13, -0.16);
  shape.lineTo(0.76, -0.16);
  shape.lineTo(0.71, -0.58);
  shape.lineTo(-0.60, -0.58);
  shape.lineTo(-0.46, 0.56);
  shape.lineTo(1.46, 0.56);
  shape.lineTo(1.52, 1.05);
  shape.lineTo(-1.19, 1.05);
  shape.closePath();
  return shape;
}

function createLetterFShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Contorno geométrico hermano de la letra F con trazos calibrados para biselado 3D
  shape.moveTo(-1.42, -1.05);
  shape.lineTo(-0.58, -1.05);
  shape.lineTo(-0.48, -0.22);
  shape.lineTo(0.95, -0.22);
  shape.lineTo(1.02, 0.26);
  shape.lineTo(-0.42, 0.26);
  shape.lineTo(-0.38, 0.55);
  shape.lineTo(1.45, 0.55);
  shape.lineTo(1.52, 1.05);
  shape.lineTo(-1.16, 1.05);
  shape.closePath();
  return shape;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Monograma GF esculpido en 3D real mediante WebGL / Three.js:
 * - Dos mallas independientes ExtrudeGeometry biseladas (G y F) con material PBR metálico.
 * - Entorno procedural RoomEnvironment + PMREMGenerator y dos luces orbitales reactivas.
 * - Coreografía: Hero Reveal con resorte amortiguado, seguimiento magnético con paralaje,
 *   separación en hover (±0.18 u.), giro giroscópico 360° al hacer clic e idle breathing.
 */
export const Monogram3D: React.FC<Monogram3DProps> = memo(({ className = '' }) => {
  const { calmMode, liteMode } = useDisplayMode();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerSpinRef = useRef<(() => void) | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean>(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const isStatic = calmMode || liteMode || prefersReducedMotion;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const canvas = renderer.domElement;
    canvas.className = 'studio-gf-webgl-canvas';
    canvas.setAttribute('aria-hidden', 'true');

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const initialRect = container.getBoundingClientRect();
    const initialW = Math.max(Math.round(initialRect.width), 200);
    const initialH = Math.max(Math.round(initialRect.height), 75);
    renderer.setSize(initialW, initialH, false);
    container.replaceChildren(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(16, initialW / initialH, 0.1, 60);
    camera.position.set(0, 0, 12.2);

    // Iluminación de estudio procedural sin HDR externos
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = envRT.texture;
    roomEnvironment.dispose();

    const ambientFill = new THREE.AmbientLight(0xdbeafe, 0.25);
    scene.add(ambientFill);

    // Luz fría plateada/azulada y luz cálida de borde que orbitan siguiendo el cursor
    const coolAccentLight = new THREE.DirectionalLight(0x7dd3fc, 2.7);
    coolAccentLight.position.set(-4.5, 3.2, 5.2);
    scene.add(coolAccentLight);

    const warmRimLight = new THREE.DirectionalLight(0xfff1dc, 2.35);
    warmRimLight.position.set(4.8, -2.4, 4.4);
    scene.add(warmRimLight);

    const extrudeOptions: THREE.ExtrudeGeometryOptions = {
      depth: 0.46,
      bevelEnabled: true,
      bevelThickness: 0.11,
      bevelSize: 0.075,
      bevelOffset: 0,
      bevelSegments: 5,
      curveSegments: 16,
    };

    const gGeometry = new THREE.ExtrudeGeometry(createLetterGShape(), extrudeOptions);
    gGeometry.center();

    const fGeometry = new THREE.ExtrudeGeometry(createLetterFShape(), extrudeOptions);
    fGeometry.center();

    const gMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x677487,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      iridescence: 0.25,
      iridescenceIOR: 1.35,
      envMapIntensity: 1.5,
      reflectivity: 1.0,
    });

    const fMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x5f7b92,
      metalness: 0.92,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.12,
      iridescence: 0.25,
      iridescenceIOR: 1.4,
      envMapIntensity: 1.5,
      reflectivity: 1.0,
    });

    const gfGroup = new THREE.Group();
    const gMesh = new THREE.Mesh(gGeometry, gMaterial);
    const fMesh = new THREE.Mesh(fGeometry, fMaterial);
    gMesh.position.set(G_BASE_X, 0, 0);
    fMesh.position.set(F_BASE_X, 0, 0);
    gfGroup.add(gMesh, fMesh);
    scene.add(gfGroup);

    const renderFrame = () => {
      renderer.render(scene, camera);
    };

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const w = Math.max(Math.round(entry.contentRect.width), 1);
      const h = Math.max(Math.round(entry.contentRect.height), 1);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(w, h, false);
      renderFrame();
    });
    resizeObserver.observe(container);

    if (isStatic) {
      triggerSpinRef.current = null;
      renderFrame();
      return () => {
        resizeObserver.disconnect();
        gGeometry.dispose();
        fGeometry.dispose();
        gMaterial.dispose();
        fMaterial.dispose();
        envRT.dispose();
        pmremGenerator.dispose();
        renderer.dispose();
        container.replaceChildren();
      };
    }

    const stageEl = (container.closest('.studio-hero-stage') as HTMLElement | null) ?? document.documentElement;

    // Estado de puntero magnético y hover directo sobre GF
    let targetNx = 0;
    let targetNy = 0;
    let currentNx = 0;
    let currentNy = 0;
    let pointerActive = false;
    let pointerBlend = 0;
    let isHovered = false;
    let hoverSplit = 0;

    // Hero Reveal (resorte amortiguado de entrada desde ángulos/profundidad opuestos)
    let gRevealX = -1.35;
    let gRevealY = 0.28;
    let gRevealZ = -3.1;
    let gRevealRx = -0.34;
    let gRevealRy = 0.85;
    let gRevealVx = 0;
    let gRevealVy = 0;
    let gRevealVz = 0;
    let gRevealVrx = 0;
    let gRevealVry = 0;

    let fRevealX = 1.35;
    let fRevealY = -0.28;
    let fRevealZ = 2.3;
    let fRevealRx = 0.34;
    let fRevealRy = -0.85;
    let fRevealVx = 0;
    let fRevealVy = 0;
    let fRevealVz = 0;
    let fRevealVrx = 0;
    let fRevealVry = 0;

    // Giro giroscópico 360° en eje Y con rebote elástico al hacer clic
    let spinTargetY = 0;
    let spinAngleY = 0;
    let spinVelocityY = 0;

    triggerSpinRef.current = () => {
      spinTargetY += Math.PI * 2;
    };

    const updatePointerFromClient = (clientX: number, clientY: number) => {
      const rect = stageEl.getBoundingClientRect();
      targetNx = clamp((clientX - rect.left) / Math.max(rect.width, 1) - 0.5, -0.5, 0.5) * 2;
      targetNy = clamp((clientY - rect.top) / Math.max(rect.height, 1) - 0.5, -0.5, 0.5) * 2;
      pointerActive = true;
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointerFromClient(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointerFromClient(touch.clientX, touch.clientY);
    };

    const resetPointer = () => {
      targetNx = 0;
      targetNy = 0;
      pointerActive = false;
    };

    const handleMouseEnter = () => {
      isHovered = true;
    };

    const handleMouseLeave = () => {
      isHovered = false;
    };

    let rafId: number | null = null;
    let lastTimestamp = performance.now();
    let elapsedSec = 0;

    const springStep = (
      pos: number,
      vel: number,
      target: number,
      stiffness: number,
      damping: number,
      dt: number
    ): [number, number] => {
      const force = (target - pos) * stiffness;
      const nextVel = (vel + force * dt) * Math.exp(-damping * dt);
      const nextPos = pos + nextVel * dt;
      return [nextPos, nextVel];
    };

    const tick = (now: number) => {
      if (document.hidden) {
        rafId = null;
        return;
      }

      const dtMs = clamp(now - lastTimestamp, 1, 50);
      const dt = dtMs / 1000;
      lastTimestamp = now;
      elapsedSec += dt;

      const lerpAlpha = 1 - Math.pow(1 - 0.085, dtMs / 16.667);
      const hoverAlpha = 1 - Math.pow(1 - 0.12, dtMs / 16.667);
      const blendAlpha = 1 - Math.pow(1 - 0.055, dtMs / 16.667);

      currentNx += (targetNx - currentNx) * lerpAlpha;
      currentNy += (targetNy - currentNy) * lerpAlpha;
      pointerBlend += ((pointerActive ? 1 : 0) - pointerBlend) * blendAlpha;
      hoverSplit += ((isHovered ? 1 : 0) - hoverSplit) * hoverAlpha;

      // Paso de resorte Hero Reveal para G y F
      [gRevealX, gRevealVx] = springStep(gRevealX, gRevealVx, 0, 118, 12.5, dt);
      [gRevealY, gRevealVy] = springStep(gRevealY, gRevealVy, 0, 118, 12.5, dt);
      [gRevealZ, gRevealVz] = springStep(gRevealZ, gRevealVz, 0, 110, 12.0, dt);
      [gRevealRx, gRevealVrx] = springStep(gRevealRx, gRevealVrx, 0, 115, 12.0, dt);
      [gRevealRy, gRevealVry] = springStep(gRevealRy, gRevealVry, 0, 115, 12.0, dt);

      [fRevealX, fRevealVx] = springStep(fRevealX, fRevealVx, 0, 118, 12.5, dt);
      [fRevealY, fRevealVy] = springStep(fRevealY, fRevealVy, 0, 118, 12.5, dt);
      [fRevealZ, fRevealVz] = springStep(fRevealZ, fRevealVz, 0, 110, 12.0, dt);
      [fRevealRx, fRevealVrx] = springStep(fRevealRx, fRevealVrx, 0, 115, 12.0, dt);
      [fRevealRy, fRevealVry] = springStep(fRevealRy, fRevealVry, 0, 115, 12.0, dt);

      // Resorte subamortiguado para giro giroscópico 360° con rebote elástico al volver al frente
      [spinAngleY, spinVelocityY] = springStep(spinAngleY, spinVelocityY, spinTargetY, 82, 8.2, dt);

      // Respiración orgánica en reposo
      const idleWeight = 1 - pointerBlend * 0.65;
      const idleY = Math.sin(elapsedSec * 1.25) * 0.068 * idleWeight;
      const idleRx = Math.cos(elapsedSec * 0.95) * 0.045 * idleWeight;
      const idleRy = Math.sin(elapsedSec * 0.72) * 0.075 * idleWeight;

      // Inclinación magnética conjunta + giroscópico
      const magRx = currentNy * 0.28;
      const magRy = currentNx * 0.34;
      const gyroTiltX = clamp(spinVelocityY * 0.032, -0.22, 0.22);

      gfGroup.position.y = idleY;
      gfGroup.rotation.x = magRx + idleRx + gyroTiltX;
      gfGroup.rotation.y = magRy + idleRy + spinAngleY;

      // Separación en hover (±0.18 u. en X y Z) + micro-paralaje interno entre G y F
      const parallaxZ = currentNx * 0.14;
      const hoverOffset = hoverSplit * 0.18;

      gMesh.position.set(
        G_BASE_X - hoverOffset + gRevealX,
        gRevealY,
        hoverOffset + parallaxZ + gRevealZ
      );
      gMesh.rotation.set(
        gRevealRx + currentNy * 0.05,
        gRevealRy - hoverSplit * 0.05,
        0
      );

      fMesh.position.set(
        F_BASE_X + hoverOffset + fRevealX,
        fRevealY,
        -hoverOffset - parallaxZ + fRevealZ
      );
      fMesh.rotation.set(
        fRevealRx - currentNy * 0.05,
        fRevealRy + hoverSplit * 0.05,
        0
      );

      // Intensidad especular reactiva al hover
      const targetEnvIntensity = 1.5 + hoverSplit * 0.95;
      gMaterial.envMapIntensity = targetEnvIntensity;
      fMaterial.envMapIntensity = targetEnvIntensity;
      gMaterial.clearcoatRoughness = 0.12 - hoverSplit * 0.06;
      fMaterial.clearcoatRoughness = 0.12 - hoverSplit * 0.06;

      // Órbita dinámica de luces siguiendo el cursor sobre los biseles
      const orbitAngle = elapsedSec * 0.45 + currentNx * 1.15;
      coolAccentLight.position.set(
        Math.cos(orbitAngle) * 5.2 + currentNx * 2.5,
        Math.sin(orbitAngle * 0.8) * 3.0 - currentNy * 2.8,
        5.0 + Math.sin(orbitAngle) * 1.4
      );
      coolAccentLight.intensity = 2.6 + hoverSplit * 0.7;

      warmRimLight.position.set(
        -Math.cos(orbitAngle) * 5.2 - currentNx * 1.8,
        -Math.sin(orbitAngle * 0.8) * 2.6 + currentNy * 2.4,
        4.6 - Math.sin(orbitAngle) * 1.2
      );
      warmRimLight.intensity = 2.3 + hoverSplit * 0.65;

      renderFrame();
      rafId = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafId !== null || document.hidden) return;
      lastTimestamp = performance.now();
      rafId = window.requestAnimationFrame(tick);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafId !== null) {
          window.cancelAnimationFrame(rafId);
          rafId = null;
        }
      } else {
        startLoop();
      }
    };

    stageEl.addEventListener('mousemove', handleMouseMove, { passive: true });
    stageEl.addEventListener('mouseleave', resetPointer, { passive: true });
    stageEl.addEventListener('touchmove', handleTouchMove, { passive: true });
    stageEl.addEventListener('touchend', resetPointer, { passive: true });
    stageEl.addEventListener('touchcancel', resetPointer, { passive: true });
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseleave', resetPointer, { passive: true });
    window.addEventListener('blur', resetPointer);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    startLoop();

    return () => {
      triggerSpinRef.current = null;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      stageEl.removeEventListener('mousemove', handleMouseMove);
      stageEl.removeEventListener('mouseleave', resetPointer);
      stageEl.removeEventListener('touchmove', handleTouchMove);
      stageEl.removeEventListener('touchend', resetPointer);
      stageEl.removeEventListener('touchcancel', resetPointer);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseleave', resetPointer);
      window.removeEventListener('blur', resetPointer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      gGeometry.dispose();
      fGeometry.dispose();
      gMaterial.dispose();
      fMaterial.dispose();
      envRT.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      container.replaceChildren();
    };
  }, [isStatic]);

  const handleActivate = () => {
    if (!isStatic && triggerSpinRef.current) {
      triggerSpinRef.current();
    }
  };

  if (webglFailed) {
    return (
      <div className={`studio-gf-monolith ${className}`} aria-label="Monograma GF">
        <svg viewBox="0 0 340 128" className="studio-gf-chrome-base" role="img" aria-hidden="true">
          <path
            d="M44 10H156L146 28H26L44 10ZM184 10H304L322 28H174L184 10Z"
            fill="#94A3B8"
          />
          <path
            d="M26 28H146L154 52H68V94H120V78H92V58H164L154 118H16L26 28Z"
            fill="#CBD5E1"
          />
          <path
            d="M174 28H322L312 52H214V68H288L282 90H214V118H166L174 28Z"
            fill="#94A3B8"
          />
        </svg>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`studio-gf-monolith ${!isStatic ? 'is-interactive' : ''} ${className}`}
      data-static={isStatic ? 'true' : undefined}
      aria-label="Monograma GF"
      onClick={handleActivate}
    />
  );
});

Monogram3D.displayName = 'Monogram3D';

export default Monogram3D;
