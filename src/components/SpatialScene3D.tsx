import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { useDisplayMode } from '../context/DisplayModeContext';

interface MonolithPartSpec {
  id: string;
  shape: THREE.Shape;
  depth: number;
  basePos: [number, number, number];
  explodeVec: [number, number, number];
  materialType: 'obsidian' | 'titanium';
}

function buildGFModuleSpecs(): MonolithPartSpec[] {
  const gChassis = new THREE.Shape();
  gChassis.moveTo(-0.16, 0.78);
  gChassis.lineTo(-1.02, 0.78);
  gChassis.lineTo(-1.26, 0.54);
  gChassis.lineTo(-1.26, -0.54);
  gChassis.lineTo(-1.02, -0.78);
  gChassis.lineTo(-0.14, -0.78);
  gChassis.lineTo(-0.14, -0.14);
  gChassis.lineTo(-0.42, -0.14);
  gChassis.lineTo(-0.42, -0.49);
  gChassis.lineTo(-0.94, -0.49);
  gChassis.lineTo(-0.97, -0.46);
  gChassis.lineTo(-0.97, 0.46);
  gChassis.lineTo(-0.94, 0.49);
  gChassis.lineTo(-0.16, 0.49);
  gChassis.closePath();

  const gArm = new THREE.Shape();
  gArm.moveTo(-0.62, 0.14);
  gArm.lineTo(-0.08, 0.14);
  gArm.lineTo(-0.08, -0.14);
  gArm.lineTo(-0.52, -0.14);
  gArm.lineTo(-0.62, -0.04);
  gArm.closePath();

  const fSpine = new THREE.Shape();
  fSpine.moveTo(0.18, 0.78);
  fSpine.lineTo(0.49, 0.78);
  fSpine.lineTo(0.49, -0.78);
  fSpine.lineTo(0.28, -0.78);
  fSpine.lineTo(0.18, -0.66);
  fSpine.closePath();

  const fTop = new THREE.Shape();
  fTop.moveTo(0.55, 0.78);
  fTop.lineTo(1.26, 0.78);
  fTop.lineTo(1.12, 0.48);
  fTop.lineTo(0.55, 0.48);
  fTop.closePath();

  const fMid = new THREE.Shape();
  fMid.moveTo(0.55, 0.18);
  fMid.lineTo(1.06, 0.18);
  fMid.lineTo(0.92, -0.11);
  fMid.lineTo(0.55, -0.11);
  fMid.closePath();

  return [
    {
      id: 'g-chassis',
      shape: gChassis,
      depth: 0.28,
      basePos: [0, 0, -0.04],
      explodeVec: [-0.32, 0.12, 0.18],
      materialType: 'obsidian',
    },
    {
      id: 'g-arm',
      shape: gArm,
      depth: 0.22,
      basePos: [0, 0, 0.1],
      explodeVec: [-0.08, -0.18, 0.34],
      materialType: 'titanium',
    },
    {
      id: 'f-spine',
      shape: fSpine,
      depth: 0.3,
      basePos: [0, 0, 0.02],
      explodeVec: [0.18, -0.16, 0.22],
      materialType: 'obsidian',
    },
    {
      id: 'f-top',
      shape: fTop,
      depth: 0.24,
      basePos: [0, 0, 0.08],
      explodeVec: [0.36, 0.26, 0.16],
      materialType: 'titanium',
    },
    {
      id: 'f-mid',
      shape: fMid,
      depth: 0.22,
      basePos: [0, 0, -0.06],
      explodeVec: [0.28, -0.06, -0.24],
      materialType: 'obsidian',
    },
  ];
}

const HERO_FOV = 40;
const HERO_CAM_Z = 6.95;

export const SpatialScene3D: React.FC = () => {
  const { calmMode, liteMode } = useDisplayMode();
  const mountRef = useRef<HTMLDivElement | null>(null);
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
    const container = mountRef.current;
    if (!container) return;

    const isStaticMode = calmMode || osReducedMotion;

    let disposed = false;
    let rafId = 0;
    let contextLost = false;
    let isHeroVisible = true;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !liteMode,
        powerPreference: liteMode ? 'low-power' : 'high-performance',
      });
    } catch {
      return;
    }

    const getDpr = () =>
      THREE.MathUtils.clamp(window.devicePixelRatio || 1, 1, liteMode ? 1.25 : 2);

    let stageW = Math.max(container.clientWidth || window.innerWidth, 1);
    let stageH = Math.max(container.clientHeight || window.innerHeight, 1);

    renderer.setPixelRatio(getDpr());
    renderer.setSize(stageW, stageH, false);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.className = 'studio-webgl-canvas';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050507, 0.045);

    const camera = new THREE.PerspectiveCamera(HERO_FOV, stageW / stageH, 0.1, 60);
    camera.position.set(0, 0, HERO_CAM_Z);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envTarget = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envTarget.texture;
    roomEnv.dispose();
    pmremGenerator.dispose();

    const ambient = new THREE.AmbientLight(0xdbe4f0, 0.55);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xf8fafc, 2.2);
    keyLight.position.set(4.5, 6.2, 5.5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x94a3b8, 1.55);
    rimLight.position.set(-5.5, -2.5, -4.0);
    scene.add(rimLight);

    const pointerLight = new THREE.PointLight(0xe2e8f0, 2.4, 14, 1.8);
    pointerLight.position.set(2.2, 1.8, 3.6);
    scene.add(pointerLight);

    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x090c12,
      metalness: 0.16,
      roughness: 0.09,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      iridescence: 0.34,
      iridescenceIOR: 1.42,
      envMapIntensity: 1.65,
      specularIntensity: 1.0,
      reflectivity: 0.92,
    });

    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0xb8c2d0,
      metalness: 0.94,
      roughness: 0.18,
      clearcoat: 0.55,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.5,
      reflectivity: 1.0,
    });

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xcbd5e1,
      transparent: true,
      opacity: 0.38,
    });

    const edgeStrongMat = new THREE.LineBasicMaterial({
      color: 0xf8fafc,
      transparent: true,
      opacity: 0.62,
    });

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      metalness: 0.9,
      roughness: 0.24,
      transparent: true,
      opacity: 0.42,
      envMapIntensity: 1.2,
    });

    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x1e2530,
      metalness: 0.82,
      roughness: 0.22,
      envMapIntensity: 1.4,
    });

    const stageRoot = new THREE.Group();
    scene.add(stageRoot);

    const monolithGroup = new THREE.Group();
    stageRoot.add(monolithGroup);

    const partSpecs = buildGFModuleSpecs();
    const animatedParts: Array<{
      group: THREE.Group;
      basePos: [number, number, number];
      explodeVec: [number, number, number];
      phase: number;
    }> = [];

    partSpecs.forEach((spec, idx) => {
      const extrudeGeo = new THREE.ExtrudeGeometry(spec.shape, {
        depth: spec.depth,
        bevelEnabled: true,
        bevelThickness: 0.032,
        bevelSize: 0.024,
        bevelSegments: liteMode ? 1 : 3,
        curveSegments: liteMode ? 6 : 12,
      });
      extrudeGeo.translate(0, 0, -spec.depth * 0.5);

      const mesh = new THREE.Mesh(
        extrudeGeo,
        spec.materialType === 'obsidian' ? obsidianMat : titaniumMat
      );

      const edgesGeo = new THREE.EdgesGeometry(extrudeGeo, 28);
      const edges = new THREE.LineSegments(
        edgesGeo,
        spec.materialType === 'titanium' ? edgeStrongMat : edgeMat
      );

      const partGroup = new THREE.Group();
      partGroup.position.set(...spec.basePos);
      partGroup.add(mesh);
      partGroup.add(edges);
      monolithGroup.add(partGroup);

      animatedParts.push({
        group: partGroup,
        basePos: spec.basePos,
        explodeVec: spec.explodeVec,
        phase: idx * 1.15,
      });
    });

    const ringsGroup = new THREE.Group();
    monolithGroup.add(ringsGroup);

    const outerRingGeo = new THREE.TorusGeometry(2.02, 0.011, 12, liteMode ? 64 : 110);
    const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
    outerRing.rotation.set(Math.PI * 0.38, Math.PI * 0.14, 0);
    ringsGroup.add(outerRing);

    const innerRingGeo = new THREE.TorusGeometry(1.62, 0.007, 10, liteMode ? 56 : 96);
    const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
    innerRing.rotation.set(-Math.PI * 0.3, Math.PI * 0.28, 0.25);
    ringsGroup.add(innerRing);

    const shardsGroup = new THREE.Group();
    monolithGroup.add(shardsGroup);

    const shardGeos = [
      new THREE.OctahedronGeometry(0.1, 0),
      new THREE.IcosahedronGeometry(0.08, 0),
    ];

    const shardCount = liteMode ? 5 : 10;
    const shardNodes: Array<{
      mesh: THREE.Mesh;
      anchor: [number, number, number];
      speed: number;
      amp: number;
      phase: number;
    }> = [];

    for (let i = 0; i < shardCount; i++) {
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 2.25 + (i % 3) * 0.55;
      const ax = Math.cos(angle) * radius;
      const ay = Math.sin(angle * 1.3) * 1.35;
      const az = -0.8 - (i % 3) * 0.45;
      const geo = shardGeos[i % shardGeos.length];
      const mesh = new THREE.Mesh(geo, shardMat);
      mesh.position.set(ax, ay, az);
      mesh.scale.setScalar(0.7 + (i % 3) * 0.25);
      shardsGroup.add(mesh);
      shardNodes.push({
        mesh,
        anchor: [ax, ay, az],
        speed: 0.35 + (i % 4) * 0.12,
        amp: 0.12 + (i % 3) * 0.05,
        phase: i * 0.9,
      });
    }

    const particleCount = liteMode ? 50 : 120;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = i * 2.3999632;
      const r = 2.4 + ((i * 17) % 100) * 0.06;
      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = (((i * 29) % 100) / 100 - 0.5) * 5.2;
      positions[i * 3 + 2] = Math.sin(theta) * r - 1.5;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0xcbd5e1,
      size: 0.028,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.38,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const dustField = new THREE.Points(dustGeo, dustMat);
    monolithGroup.add(dustField);

    // Anclaje exacto dentro de #hero-sculpture-trigger del Hero
    const anchor = { x: 1.5, y: 0.0, scale: 0.92 };
    const measureAnchor = () => {
      const cRect = container.getBoundingClientRect();
      if (cRect.width <= 0 || cRect.height <= 0) return;

      const aspect = cRect.width / cRect.height;
      const halfH = HERO_CAM_Z * Math.tan((HERO_FOV * 0.5 * Math.PI) / 180);
      const halfW = halfH * aspect;

      const triggerEl = document.getElementById('hero-sculpture-trigger');
      if (triggerEl) {
        const tRect = triggerEl.getBoundingClientRect();
        const nx = (tRect.left + tRect.width * 0.5 - cRect.left) / cRect.width;
        const ny = (tRect.top + tRect.height * 0.5 - cRect.top) / cRect.height;
        anchor.x = (nx - 0.5) * 2 * halfW;
        anchor.y = (0.5 - ny) * 2 * halfH;
        const targetWorldSpan = (Math.min(tRect.width, tRect.height) / cRect.height) * (halfH * 2);
        anchor.scale = THREE.MathUtils.clamp(targetWorldSpan / 3.8, 0.52, 0.98);
      } else {
        const isMobile = cRect.width < 900;
        anchor.x = isMobile ? 0 : halfW * 0.42;
        anchor.y = isMobile ? halfH * 0.32 : 0;
        anchor.scale = isMobile ? 0.62 : 0.92;
      }
    };

    const pointer = { targetX: 0, targetY: 0, x: 0, y: 0 };
    let pulseEnergy = 0;
    let isHovered = false;
    let hoverBlend = 0;
    let isTabHidden = document.hidden;

    const currentLookAt = new THREE.Vector3(0, 0, 0);
    const targetLookAt = new THREE.Vector3(0, 0, 0);
    const targetCamPos = new THREE.Vector3(0, 0, HERO_CAM_Z);

    const applyFrame = (elapsedSec: number, instant = false) => {
      if (contextLost || disposed) return;

      const damping = instant ? 1 : 0.08;
      pointer.x = THREE.MathUtils.lerp(pointer.x, pointer.targetX, damping);
      pointer.y = THREE.MathUtils.lerp(pointer.y, pointer.targetY, damping);
      hoverBlend = THREE.MathUtils.lerp(hoverBlend, isHovered ? 1 : 0, 0.08);
      pulseEnergy = Math.max(0, pulseEnergy * (instant ? 0 : 0.94));

      targetCamPos.set(pointer.x * 0.28, pointer.y * 0.2, HERO_CAM_Z);
      if (instant) {
        camera.position.copy(targetCamPos);
      } else {
        camera.position.lerp(targetCamPos, 0.085);
      }

      targetLookAt.set(pointer.x * 0.1, pointer.y * 0.07, 0);
      if (instant) {
        currentLookAt.copy(targetLookAt);
      } else {
        currentLookAt.lerp(targetLookAt, 0.09);
      }
      camera.lookAt(currentLookAt);

      const hoverScale = 1 + hoverBlend * 0.045 + pulseEnergy * 0.07;
      monolithGroup.scale.setScalar(anchor.scale * hoverScale);

      const idleFloatY = isStaticMode ? 0 : Math.sin(elapsedSec * 0.85) * 0.065;
      monolithGroup.position.set(anchor.x, anchor.y + idleFloatY, 0);

      monolithGroup.rotation.set(
        0.08 + pointer.y * 0.22 + (isStaticMode ? 0 : Math.sin(elapsedSec * 0.5) * 0.03),
        -0.24 + pointer.x * 0.34 + (isStaticMode ? 0 : elapsedSec * 0.08),
        0.02
      );

      const expandFactor = pulseEnergy * 0.55 + hoverBlend * 0.06;
      for (let i = 0; i < animatedParts.length; i++) {
        const p = animatedParts[i];
        const microWave = isStaticMode ? 0 : Math.sin(elapsedSec * 1.4 + p.phase) * 0.012;
        p.group.position.set(
          p.basePos[0] + p.explodeVec[0] * expandFactor,
          p.basePos[1] + p.explodeVec[1] * expandFactor + microWave,
          p.basePos[2] + p.explodeVec[2] * expandFactor
        );
      }

      outerRing.rotation.z = elapsedSec * 0.15;
      innerRing.rotation.z = -elapsedSec * 0.22;

      pointerLight.position.set(
        anchor.x + 1.8 + pointer.x * 2.2,
        anchor.y + 1.4 + pointer.y * 1.8,
        3.6 + hoverBlend * 0.8
      );
      edgeMat.opacity = 0.38 + hoverBlend * 0.2 + pulseEnergy * 0.24;
      edgeStrongMat.opacity = 0.64 + hoverBlend * 0.24;

      for (let i = 0; i < shardNodes.length; i++) {
        const s = shardNodes[i];
        const wave = isStaticMode ? 0 : Math.sin(elapsedSec * s.speed + s.phase) * s.amp;
        s.mesh.position.set(s.anchor[0], s.anchor[1] + wave, s.anchor[2]);
        if (!isStaticMode) {
          s.mesh.rotation.x += 0.004;
          s.mesh.rotation.y += 0.006;
        }
      }

      if (!isStaticMode) {
        dustField.rotation.y = elapsedSec * 0.02 + pointer.x * 0.05;
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (disposed) return;
      const w = Math.max(container.clientWidth, 1);
      const h = Math.max(container.clientHeight, 1);
      if (w !== stageW || h !== stageH) {
        stageW = w;
        stageH = h;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setPixelRatio(getDpr());
        renderer.setSize(w, h, false);
      }
      measureAnchor();
      if (isStaticMode) applyFrame(0, true);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || isStaticMode || isTabHidden || !isHeroVisible) return;
      pointer.targetX = (e.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
      pointer.targetY = -(e.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
    };

    const handlePulse = () => {
      if (isStaticMode) return;
      pulseEnergy = Math.min(1.0, pulseEnergy + 0.78);
    };

    const handleHoverEvent = (e: Event) => {
      const detail = (e as CustomEvent<{ active: boolean }>).detail;
      isHovered = Boolean(detail?.active);
    };

    const handleVisibility = () => {
      isTabHidden = document.hidden;
    };

    const startTime = performance.now();
    const tick = (now: number) => {
      if (disposed || isStaticMode || contextLost) return;
      rafId = window.requestAnimationFrame(tick);
      if (isTabHidden || !isHeroVisible) return;
      const elapsedSec = (now - startTime) * 0.001;
      applyFrame(elapsedSec, false);
    };

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      contextLost = true;
      if (rafId) {
        window.cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const handleContextRestored = () => {
      contextLost = false;
      measureAnchor();
      applyFrame(0, true);
      if (!isStaticMode && !rafId && !disposed) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    let heroObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== 'undefined') {
      heroObserver = new IntersectionObserver(
        (entries) => {
          isHeroVisible = Boolean(entries[0]?.isIntersecting);
        },
        { threshold: 0.01 }
      );
      heroObserver.observe(container);
    }

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('gf-sculpture-pulse', handlePulse);
    window.addEventListener('gf-sculpture-hover', handleHoverEvent);
    document.addEventListener('visibilitychange', handleVisibility);
    renderer.domElement.addEventListener('webglcontextlost', handleContextLost);
    renderer.domElement.addEventListener('webglcontextrestored', handleContextRestored);

    measureAnchor();
    applyFrame(0, true);

    if (!isStaticMode) {
      rafId = window.requestAnimationFrame(tick);
    }

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);

      resizeObserver?.disconnect();
      heroObserver?.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('gf-sculpture-pulse', handlePulse);
      window.removeEventListener('gf-sculpture-hover', handleHoverEvent);
      document.removeEventListener('visibilitychange', handleVisibility);
      renderer.domElement.removeEventListener('webglcontextlost', handleContextLost);
      renderer.domElement.removeEventListener('webglcontextrestored', handleContextRestored);

      const geos = new Set<THREE.BufferGeometry>([
        ...shardGeos,
        outerRingGeo,
        innerRingGeo,
        dustGeo,
      ]);
      const mats = new Set<THREE.Material>([
        obsidianMat,
        titaniumMat,
        edgeMat,
        edgeStrongMat,
        ringMat,
        shardMat,
        dustMat,
      ]);

      scene.traverse((obj) => {
        const meshLike = obj as unknown as {
          geometry?: THREE.BufferGeometry;
          material?: THREE.Material | THREE.Material[];
        };
        if (meshLike.geometry) geos.add(meshLike.geometry);
        if (meshLike.material) {
          if (Array.isArray(meshLike.material)) {
            meshLike.material.forEach((m) => mats.add(m));
          } else {
            mats.add(meshLike.material);
          }
        }
      });

      geos.forEach((g) => g.dispose());
      mats.forEach((m) => m.dispose());
      envTarget.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [calmMode, liteMode, osReducedMotion]);

  return <div ref={mountRef} className="studio-webgl-stage" aria-hidden="true" />;
};
