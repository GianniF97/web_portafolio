import React, { memo, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useDisplayMode } from '../context/DisplayModeContext';

interface Monogram3DProps {
  className?: string;
}

interface ModuleSpec {
  id: string;
  shape: THREE.Shape;
  baseZ: number;
  depthWeight: number;
  lerpFactor: number;
  hoverSpread: [number, number, number];
  burstVector: [number, number, number];
  burstRot: [number, number, number];
  waveDelaySec: number;
}

interface ModuleRuntime {
  spec: ModuleSpec;
  mesh: THREE.Mesh;
  geometry: THREE.ExtrudeGeometry;
  edgesGeometry: THREE.EdgesGeometry;
  edgesMaterial: THREE.LineBasicMaterial;
  basePos: THREE.Vector3;
  // Inercia independiente para paralaje por profundidad
  curNx: number;
  curNy: number;
  // Resortes para onda de expansión al clic
  sx: number;
  sy: number;
  sz: number;
  srx: number;
  sry: number;
  srz: number;
  vx: number;
  vy: number;
  vz: number;
  vrx: number;
  vry: number;
  vrz: number;
  pendingKickAt: number | null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Trazo 1 de G: arco arquitectónico principal estilizado con cortes y chaflanes a 45°.
 */
function createGArcShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.38, 1.04);
  s.lineTo(-0.70, 0.72);
  s.lineTo(-1.86, 0.72);
  s.lineTo(-2.10, 0.48);
  s.lineTo(-2.10, -0.48);
  s.lineTo(-1.86, -0.72);
  s.lineTo(-0.68, -0.72);
  s.lineTo(-0.36, -1.04);
  s.lineTo(-2.06, -1.04);
  s.lineTo(-2.42, -0.68);
  s.lineTo(-2.42, 0.68);
  s.lineTo(-2.06, 1.04);
  s.closePath();
  return s;
}

/**
 * Trazo 2 de G: espolón y barra transversal L escalonada al frente en eje Z.
 */
function createGCrossbarShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(-0.66, -0.96);
  s.lineTo(-0.66, -0.16);
  s.lineTo(-1.42, -0.16);
  s.lineTo(-1.10, 0.16);
  s.lineTo(-0.34, 0.16);
  s.lineTo(-0.34, -0.96);
  s.closePath();
  return s;
}

/**
 * Trazo 1 de F: asta vertical arquitectónica con terminaciones diagonales a 45°.
 */
function createFStemShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.38, -1.04);
  s.lineTo(0.70, -0.72);
  s.lineTo(0.70, 1.04);
  s.lineTo(0.56, 1.04);
  s.lineTo(0.38, 0.86);
  s.closePath();
  return s;
}

/**
 * Trazo 2 de F: travesaño superior escalonado detrás del asta con remate a 45°.
 */
function createFTopShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.56, 0.72);
  s.lineTo(2.10, 0.72);
  s.lineTo(2.42, 1.04);
  s.lineTo(0.56, 1.04);
  s.closePath();
  return s;
}

/**
 * Trazo 3 de F: travesaño medio adelantado en eje Z con corte limpio a 45°.
 */
function createFMidShape(): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0.56, -0.16);
  s.lineTo(1.66, -0.16);
  s.lineTo(1.98, 0.16);
  s.lineTo(0.56, 0.16);
  s.closePath();
  return s;
}

function springStep(
  pos: number,
  vel: number,
  target: number,
  stiffness: number,
  damping: number,
  dt: number
): [number, number] {
  const force = (target - pos) * stiffness;
  const nextVel = (vel + force * dt) * Math.exp(-damping * dt);
  const nextPos = pos + nextVel * dt;
  return [nextPos, nextVel];
}

/**
 * Escultura tipográfica contemporánea GF en WebGL / Three.js:
 * - 5 segmentos arquitectónicos modulares (G en 2 trazos, F en 3 trazos) con cortes a 45°
 *   y escalonamiento real en eje Z.
 * - Cristal de obsidiana ahumada (MeshPhysicalMaterial con transmisión y refracción) +
 *   contorno quirúrgico EdgesGeometry en blanco puro.
 * - Paralaje modular independiente por profundidad, expansión sutil en hover y onda de
 *   reensamblaje magnético con resorte amortiguado al hacer clic.
 */
export const Monogram3D: React.FC<Monogram3DProps> = memo(({ className = '' }) => {
  const { calmMode, liteMode } = useDisplayMode();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const triggerWaveRef = useRef<(() => void) | null>(null);
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
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const initialRect = container.getBoundingClientRect();
    const initialW = Math.max(Math.round(initialRect.width), 200);
    const initialH = Math.max(Math.round(initialRect.height), 75);
    renderer.setSize(initialW, initialH, false);
    container.replaceChildren(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(18, initialW / initialH, 0.1, 60);
    camera.position.set(0, 0, 10.6);

    // RoomEnvironment minimalista para reflejos limpios de vidrio pulido
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const roomEnvironment = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = envRT.texture;
    roomEnvironment.dispose();

    // Dos luces puntuales suaves que dibujan reflejos limpios sobre los biseles y el vidrio
    const coolPointLight = new THREE.PointLight(0xe2e8f0, 48, 26, 1.45);
    coolPointLight.position.set(-4.2, 2.8, 4.6);
    scene.add(coolPointLight);

    const rimPointLight = new THREE.PointLight(0x94a3b8, 40, 26, 1.45);
    rimPointLight.position.set(4.4, -2.2, 3.8);
    scene.add(rimPointLight);

    const obsidianGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x121215,
      transmission: 0.88,
      ior: 1.55,
      thickness: 1.4,
      roughness: 0.07,
      metalness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x94a3b8),
      attenuationDistance: 1.65,
      envMapIntensity: 1.85,
      specularIntensity: 1.0,
      transparent: true,
      opacity: 1.0,
    });

    const extrudeOptions: THREE.ExtrudeGeometryOptions = {
      depth: 0.28,
      bevelEnabled: true,
      bevelThickness: 0.042,
      bevelSize: 0.032,
      bevelOffset: 0,
      bevelSegments: 4,
      curveSegments: 16,
    };

    const specs: ModuleSpec[] = [
      {
        id: 'g-arc',
        shape: createGArcShape(),
        baseZ: 0.0,
        depthWeight: 0.55,
        lerpFactor: 0.055,
        hoverSpread: [-0.07, 0.02, -0.05],
        burstVector: [-2.6, 0.85, -1.8],
        burstRot: [0.65, -1.2, 0.32],
        waveDelaySec: 0.0,
      },
      {
        id: 'g-crossbar',
        shape: createGCrossbarShape(),
        baseZ: 0.16,
        depthWeight: 1.3,
        lerpFactor: 0.095,
        hoverSpread: [-0.03, -0.03, 0.12],
        burstVector: [-1.1, -1.25, 2.4],
        burstRot: [-0.85, 1.15, -0.42],
        waveDelaySec: 0.04,
      },
      {
        id: 'f-stem',
        shape: createFStemShape(),
        baseZ: 0.06,
        depthWeight: 0.8,
        lerpFactor: 0.07,
        hoverSpread: [0.04, -0.02, 0.04],
        burstVector: [0.95, -1.1, -1.5],
        burstRot: [0.55, 0.95, -0.25],
        waveDelaySec: 0.07,
      },
      {
        id: 'f-top',
        shape: createFTopShape(),
        baseZ: -0.12,
        depthWeight: -0.65,
        lerpFactor: 0.062,
        hoverSpread: [0.09, 0.04, -0.1],
        burstVector: [2.2, 1.35, -2.0],
        burstRot: [-0.7, 1.05, 0.35],
        waveDelaySec: 0.1,
      },
      {
        id: 'f-mid',
        shape: createFMidShape(),
        baseZ: 0.22,
        depthWeight: 1.45,
        lerpFactor: 0.11,
        hoverSpread: [0.09, -0.02, 0.14],
        burstVector: [2.5, -0.6, 2.6],
        burstRot: [0.85, -1.1, -0.3],
        waveDelaySec: 0.13,
      },
    ];

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const modules: ModuleRuntime[] = specs.map((spec) => {
      const geometry = new THREE.ExtrudeGeometry(spec.shape, extrudeOptions);
      geometry.computeBoundingBox();
      const bbox = geometry.boundingBox;
      const cx = bbox ? (bbox.min.x + bbox.max.x) * 0.5 : 0;
      const cy = bbox ? (bbox.min.y + bbox.max.y) * 0.5 : 0;
      const cz = bbox ? (bbox.min.z + bbox.max.z) * 0.5 : 0;
      // Centramos la geometría alrededor de su propio pivote conservando su posición exacta en GF
      geometry.translate(-cx, -cy, -cz);

      const mesh = new THREE.Mesh(geometry, obsidianGlassMaterial);
      const basePos = new THREE.Vector3(cx, cy, spec.baseZ);
      mesh.position.copy(basePos);

      const edgesGeometry = new THREE.EdgesGeometry(geometry, 24);
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
      });
      const edgesLine = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      mesh.add(edgesLine);
      rootGroup.add(mesh);

      return {
        spec,
        mesh,
        geometry,
        edgesGeometry,
        edgesMaterial,
        basePos,
        curNx: 0,
        curNy: 0,
        sx: 0,
        sy: 0,
        sz: 0,
        srx: 0,
        sry: 0,
        srz: 0,
        vx: 0,
        vy: 0,
        vz: 0,
        vrx: 0,
        vry: 0,
        vrz: 0,
        pendingKickAt: null,
      };
    });

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
      triggerWaveRef.current = null;
      // Leve inclinación arquitectónica estática para lucir las capas de obsidiana sin bucle
      rootGroup.rotation.set(0.05, -0.09, 0);
      renderFrame();
      return () => {
        resizeObserver.disconnect();
        for (const mod of modules) {
          mod.geometry.dispose();
          mod.edgesGeometry.dispose();
          mod.edgesMaterial.dispose();
        }
        obsidianGlassMaterial.dispose();
        envRT.dispose();
        pmremGenerator.dispose();
        renderer.dispose();
        container.replaceChildren();
      };
    }

    const stageEl =
      (container.closest('.studio-hero-stage') as HTMLElement | null) ?? document.documentElement;

    let targetNx = 0;
    let targetNy = 0;
    let pointerActive = false;
    let pointerBlend = 0;
    let isHovered = false;
    let hoverMix = 0;
    let waveFlash = 0;
    let elapsedSec = 0;
    let rafId: number | null = null;
    let lastTimestamp = performance.now();

    triggerWaveRef.current = () => {
      waveFlash = 1.0;
      const nowSec = elapsedSec;
      for (const mod of modules) {
        mod.pendingKickAt = nowSec + mod.spec.waveDelaySec;
      }
    };

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = stageEl.getBoundingClientRect();
      targetNx = clamp((clientX - rect.left) / Math.max(rect.width, 1) - 0.5, -0.5, 0.5) * 2;
      targetNy = clamp((clientY - rect.top) / Math.max(rect.height, 1) - 0.5, -0.5, 0.5) * 2;
      pointerActive = true;
    };

    const handleMouseMove = (event: MouseEvent) => {
      updatePointer(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (!touch) return;
      updatePointer(touch.clientX, touch.clientY);
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

    const tick = (now: number) => {
      if (document.hidden) {
        rafId = null;
        return;
      }

      const dtMs = clamp(now - lastTimestamp, 1, 50);
      const dt = dtMs / 1000;
      lastTimestamp = now;
      elapsedSec += dt;

      const blendAlpha = 1 - Math.pow(1 - 0.05, dtMs / 16.667);
      const hoverAlpha = 1 - Math.pow(1 - 0.1, dtMs / 16.667);

      pointerBlend += ((pointerActive ? 1 : 0) - pointerBlend) * blendAlpha;
      hoverMix += ((isHovered ? 1 : 0) - hoverMix) * hoverAlpha;
      waveFlash = Math.max(0, waveFlash - dt * 1.45);

      // Flotación gravitacional lenta en reposo
      const idleWeight = 1 - pointerBlend * 0.6;
      const idleFloatY = Math.sin(elapsedSec * 0.85) * 0.045 * idleWeight;
      const idleDriftX = Math.sin(elapsedSec * 0.55) * 0.03 * idleWeight;
      const idleDriftY = Math.cos(elapsedSec * 0.65) * 0.045 * idleWeight;

      let sumNx = 0;
      let sumNy = 0;

      for (let i = 0; i < modules.length; i += 1) {
        const mod = modules[i];
        const { spec } = mod;

        // Cada módulo posee su propia inercia lerp
        const modAlpha = 1 - Math.pow(1 - spec.lerpFactor, dtMs / 16.667);
        mod.curNx += (targetNx - mod.curNx) * modAlpha;
        mod.curNy += (targetNy - mod.curNy) * modAlpha;

        sumNx += mod.curNx;
        sumNy += mod.curNy;

        // Disparo escalonado de la onda magnética al hacer clic
        if (mod.pendingKickAt !== null && elapsedSec >= mod.pendingKickAt) {
          mod.pendingKickAt = null;
          mod.vx += spec.burstVector[0];
          mod.vy += spec.burstVector[1];
          mod.vz += spec.burstVector[2];
          mod.vrx += spec.burstRot[0];
          mod.vry += spec.burstRot[1];
          mod.vrz += spec.burstRot[2];
        }

        // Reensamblaje con resorte amortiguado hacia el origen modular
        [mod.sx, mod.vx] = springStep(mod.sx, mod.vx, 0, 92, 9.6, dt);
        [mod.sy, mod.vy] = springStep(mod.sy, mod.vy, 0, 92, 9.6, dt);
        [mod.sz, mod.vz] = springStep(mod.sz, mod.vz, 0, 88, 9.4, dt);
        [mod.srx, mod.vrx] = springStep(mod.srx, mod.vrx, 0, 86, 9.2, dt);
        [mod.sry, mod.vry] = springStep(mod.sry, mod.vry, 0, 86, 9.2, dt);
        [mod.srz, mod.vrz] = springStep(mod.srz, mod.vrz, 0, 86, 9.2, dt);

        // Desplazamiento modular por profundidad (paralaje interno + hover milimétrico + resorte)
        const depthOffsetZ = mod.curNx * 0.14 * spec.depthWeight;
        const depthOffsetX = mod.curNx * 0.055 * spec.depthWeight;
        const depthOffsetY = -mod.curNy * 0.04 * spec.depthWeight;
        const idlePhaseY = Math.sin(elapsedSec * 0.75 + i * 1.1) * 0.014 * idleWeight;

        mod.mesh.position.set(
          mod.basePos.x + depthOffsetX + spec.hoverSpread[0] * hoverMix + mod.sx,
          mod.basePos.y + depthOffsetY + spec.hoverSpread[1] * hoverMix + idlePhaseY + mod.sy,
          mod.basePos.z + depthOffsetZ + spec.hoverSpread[2] * hoverMix + mod.sz
        );

        mod.mesh.rotation.set(
          mod.curNy * 0.11 * spec.depthWeight + mod.srx,
          mod.curNx * 0.14 * spec.depthWeight + mod.sry,
          mod.srz
        );

        // Intensificación luminosa de aristas en hover y pulso magnético
        mod.edgesMaterial.opacity = clamp(0.18 + hoverMix * 0.34 + waveFlash * 0.28, 0.18, 0.8);
      }

      const avgNx = sumNx / modules.length;
      const avgNy = sumNy / modules.length;

      rootGroup.position.set(0, idleFloatY, 0);
      rootGroup.rotation.set(avgNy * 0.16 + idleDriftX, avgNx * 0.2 + idleDriftY, 0);

      // Reflejo limpio tipo vidrio pulido en hover y movimiento
      obsidianGlassMaterial.envMapIntensity = 1.85 + hoverMix * 0.9 + waveFlash * 0.45;

      const lightOrbit = elapsedSec * 0.35 + avgNx * 0.9;
      coolPointLight.position.set(
        -4.0 + Math.cos(lightOrbit) * 1.4 + avgNx * 2.2,
        2.6 - avgNy * 2.0,
        4.6 + Math.sin(lightOrbit) * 1.0
      );
      coolPointLight.intensity = 48 + hoverMix * 16;

      rimPointLight.position.set(
        4.2 - Math.cos(lightOrbit) * 1.4 - avgNx * 1.8,
        -2.2 + avgNy * 1.8,
        3.6 - Math.sin(lightOrbit) * 1.0
      );
      rimPointLight.intensity = 40 + hoverMix * 14;

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
      triggerWaveRef.current = null;
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

      for (const mod of modules) {
        mod.geometry.dispose();
        mod.edgesGeometry.dispose();
        mod.edgesMaterial.dispose();
      }
      obsidianGlassMaterial.dispose();
      envRT.dispose();
      pmremGenerator.dispose();
      renderer.dispose();
      container.replaceChildren();
    };
  }, [isStatic]);

  const handleActivate = () => {
    if (!isStatic && triggerWaveRef.current) {
      triggerWaveRef.current();
    }
  };

  if (webglFailed) {
    return (
      <div className={`studio-gf-monolith ${className}`} aria-label="Monograma GF">
        <svg viewBox="0 0 340 128" className="studio-gf-chrome-base" role="img" aria-hidden="true">
          <path
            d="M148 24H58L42 40V88L58 104H148L134 90H66L54 78V50L66 38H134Z"
            fill="#14161B"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
          />
          <path
            d="M134 62H92L106 76H134V104H148V62Z"
            fill="#1D2027"
            stroke="rgba(255,255,255,0.26)"
            strokeWidth="1.5"
          />
          <path
            d="M188 24V104H204V38L188 24ZM198 24V38H288L274 24H198ZM198 58V72H262L248 58H198Z"
            fill="#14161B"
            stroke="rgba(255,255,255,0.22)"
            strokeWidth="1.5"
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
