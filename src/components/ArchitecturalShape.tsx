import React, { useEffect, useRef, memo } from 'react';

/**
 * Escultura arquitectónica tridimensional de alta fidelidad
 * Renderiza una pieza escultórica poliédrica paramétrica con:
 * - Volumen y profundidad espacial calculados con vectores normales 3D reales.
 * - Sombreado con iluminación directa (Key Light), luz de rebote menta (Fill Light) y reflejos especulares lima (Phong/Blinn).
 * - Rotación tridimensional continua suave combinada con levitación sinusoidal fluida.
 * - Sombra de contacto ambiental proyectada sobre el plano inferior que respira con la elevación.
 * - Reacción elástica sutil al movimiento del cursor en escritorio y al scroll.
 * - Paleta integrada: Verde casi negro (#101714), verde pizarra (#222E26), verde menta (#78BFA1) y acento lima (#B8E986).
 * - Soporte de prefers-reduced-motion y renderizado Retina (HiDPI) de 60fps sin librerías pesadas.
 */
export const ArchitecturalShape: React.FC<{ className?: string }> = memo(({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Estado de rotación y movimiento
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let scrollYOffset = 0;

    // Vértices 3D normalizados de una escultura monolítica arquitectónica facetada
    // Corona superior facetada, cuerpo prismático biselado y base ahusada
    const rawVertices: Array<[number, number, number]> = [
      // 0: Vértice superior cumbre
      [0, -1.95, 0],
      // 1-4: Corona facetada superior
      [-0.85, -1.3, -0.65],
      [0.85, -1.3, -0.65],
      [0.95, -1.15, 0.75],
      [-0.95, -1.15, 0.75],
      // 5-8: Cuerpo central saliente con biselado arquitectónico
      [-1.35, -0.05, -0.75],
      [1.35, -0.05, -0.75],
      [1.45, 0.15, 0.85],
      [-1.45, 0.15, 0.85],
      // 9-12: Zona inferior angulada
      [-0.9, 1.25, -0.6],
      [0.9, 1.25, -0.6],
      [0.8, 1.35, 0.7],
      [-0.8, 1.35, 0.7],
      // 13: Base inferior en quilla
      [0, 1.9, 0],
      // 14-15: Núcleos angulares frontales que crean profundidad y aristas visibles
      [0, 0.1, 1.15],
      [0, -0.05, -1.05],
    ];

    // Caras poligonales con orientación en sentido horario (CW) para cálculo del vector normal
    // y asignación de tono material base de la nueva paleta verde carbón / verde pizarra
    const faces: Array<{ indices: number[]; baseR: number; baseG: number; baseB: number }> = [
      // Corona superior (4 caras piramidales)
      { indices: [0, 2, 1], baseR: 34, baseG: 46, baseB: 38 },
      { indices: [0, 3, 2], baseR: 42, baseG: 56, baseB: 46 },
      { indices: [0, 4, 3], baseR: 38, baseG: 52, baseB: 42 },
      { indices: [0, 1, 4], baseR: 28, baseG: 38, baseB: 32 },

      // Cuerpo superior frontal (conectado con el nodo angular 14)
      { indices: [4, 14, 7, 8], baseR: 34, baseG: 46, baseB: 38 },
      { indices: [3, 6, 7, 14], baseR: 45, baseG: 60, baseB: 50 },
      { indices: [4, 3, 14], baseR: 48, baseG: 64, baseB: 52 },

      // Cuerpo superior trasero (conectado con el nodo angular 15)
      { indices: [1, 2, 15], baseR: 22, baseG: 30, baseB: 25 },
      { indices: [2, 6, 5, 15], baseR: 24, baseG: 33, baseB: 27 },
      { indices: [1, 15, 5], baseR: 20, baseG: 28, baseB: 23 },

      // Laterales biselados
      { indices: [1, 5, 8, 4], baseR: 26, baseG: 36, baseB: 30 },
      { indices: [2, 3, 7, 6], baseR: 40, baseG: 54, baseB: 44 },

      // Cuerpo inferior frontal
      { indices: [8, 7, 11, 12], baseR: 36, baseG: 48, baseB: 40 },
      { indices: [14, 8, 12], baseR: 32, baseG: 44, baseB: 36 },
      { indices: [14, 11, 7], baseR: 42, baseG: 56, baseB: 46 },

      // Cuerpo inferior trasero
      { indices: [5, 9, 10, 6], baseR: 22, baseG: 30, baseB: 25 },
      { indices: [5, 8, 12, 9], baseR: 24, baseG: 34, baseB: 28 },
      { indices: [6, 10, 11, 7], baseR: 30, baseG: 40, baseB: 34 },

      // Base inferior cónica ahusada hacia el vértice 13
      { indices: [13, 9, 10], baseR: 20, baseG: 28, baseB: 23 },
      { indices: [13, 10, 11], baseR: 28, baseG: 38, baseB: 32 },
      { indices: [13, 11, 12], baseR: 32, baseG: 44, baseB: 36 },
      { indices: [13, 12, 9], baseR: 22, baseG: 31, baseB: 25 },
    ];

    // Fuentes de luz direccionales en el espacio 3D
    // Key Light: luz principal desde arriba a la derecha y frontal (tonalidad blanca cálida con tinte lima)
    const keyLight = normalize([0.55, -0.85, 1.15]);
    // Fill Light: luz secundaria de rebote desde abajo a la izquierda (tonalidad verde menta suave)
    const fillLight = normalize([-0.65, 0.75, -0.35]);
    // Dirección de la cámara / observador
    const viewDir = [0, 0, 1];
    // Vector mitad para reflejo especular Blinn-Phong
    const halfVector = normalize([keyLight[0] + viewDir[0], keyLight[1] + viewDir[1], keyLight[2] + viewDir[2]]);

    function normalize(v: [number, number, number]): [number, number, number] {
      const len = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]) || 1;
      return [v[0] / len, v[1] / len, v[2] / len];
    }

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      targetMouseX = nx;
      targetMouseY = ny;
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY || window.pageYOffset;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    let canvasWidth = 0;
    let canvasHeight = 0;
    let dpr = 1;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasWidth = rect.width;
      canvasHeight = rect.height;
      canvas.width = Math.floor(canvasWidth * dpr);
      canvas.height = Math.floor(canvasHeight * dpr);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Bucle de renderizado
    let startTime = performance.now();

    const render = (time: number) => {
      const elapsed = time - startTime;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      if (canvasWidth === 0 || canvasHeight === 0) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      // Animación continua y respuesta elástica a interacción
      let angleY: number;
      let angleX: number;
      let angleZ: number;
      let levitateY: number;

      if (prefersReducedMotion) {
        // En modo reducido: perspectiva estática perfectamente balanceada y sombreada
        angleY = 0.75;
        angleX = 0.32;
        angleZ = 0.08;
        levitateY = 0;
      } else {
        // Suavizado elástico del cursor (amortiguación 0.045)
        currentMouseX += (targetMouseX - currentMouseX) * 0.045;
        currentMouseY += (targetMouseY - currentMouseY) * 0.045;

        // Rotación continua 360° más oscilaciones armónicas suaves
        const autoYaw = elapsed * 0.00065;
        const autoPitch = Math.sin(elapsed * 0.00085) * 0.14;
        const autoRoll = Math.cos(elapsed * 0.0007) * 0.07;
        const scrollEffect = scrollYOffset * 0.0018;

        // Composición final de ángulos: continuo + cursor + scroll
        angleY = autoYaw + currentMouseX * 0.42 + scrollEffect;
        angleX = 0.28 + autoPitch + currentMouseY * 0.32 + scrollEffect * 0.25;
        angleZ = autoRoll + currentMouseX * 0.12;

        // Levitación continua flotante suave (12px de amplitud)
        levitateY = Math.sin(elapsed * 0.0016) * 12;
      }

      // Matrices trigonométricas
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      const cx = canvasWidth / 2;
      const cy = canvasHeight / 2 + levitateY * 0.7;
      const scale = Math.min(canvasWidth, canvasHeight) * 0.31;
      const cameraDist = 4.4;

      // 1. DIBUJAR SOMBRA DE CONTACTO AMBIENTAL FLOTANTE EN EL SUELO
      // La sombra se expande y atenúa cuando la escultura sube, y se contrae cuando baja
      const shadowElevRatio = prefersReducedMotion ? 0 : levitateY / 12;
      const shadowRadiusX = Math.min(130, scale * 0.95) * (1 + shadowElevRatio * 0.12);
      const shadowRadiusY = shadowRadiusX * 0.22;
      const shadowCenterY = canvasHeight / 2 + scale * 1.55;
      const shadowAlpha = 0.38 - shadowElevRatio * 0.08;

      ctx.save();
      const shadowGrad = ctx.createRadialGradient(
        cx,
        shadowCenterY,
        0,
        cx,
        shadowCenterY,
        shadowRadiusX
      );
      shadowGrad.addColorStop(0, `rgba(0, 0, 0, ${shadowAlpha})`);
      shadowGrad.addColorStop(0.4, `rgba(16, 23, 20, ${shadowAlpha * 0.75})`);
      shadowGrad.addColorStop(1, 'rgba(16, 23, 20, 0)');

      ctx.beginPath();
      ctx.ellipse(cx, shadowCenterY, shadowRadiusX, shadowRadiusY, 0, 0, Math.PI * 2);
      ctx.fillStyle = shadowGrad;
      ctx.fill();
      ctx.restore();

      // 2. TRANSFORMACIÓN 3D DE VÉRTICES (Rotación Yaw -> Pitch -> Roll)
      const transformedVertices = rawVertices.map(([x, y, z]) => {
        // Rotación en Y (Yaw)
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotación en X (Pitch)
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Rotación en Z (Roll)
        const x3 = x1 * cosZ - y2 * sinZ;
        const y3 = x1 * sinZ + y2 * cosZ;
        const z3 = z2;

        // Proyección en perspectiva 3D
        const pz = cameraDist + z3;
        const factor = cameraDist / pz;
        const px = x3 * factor * scale + cx;
        const py = y3 * factor * scale + cy;

        return { x: px, y: py, z: z3, wx: x3, wy: y3, wz: z3 };
      });

      // 3. PROCESAMIENTO Y ORDENAMIENTO DE CARAS (Depth Sorting + Backface Culling)
      interface RenderableFace {
        face: typeof faces[0];
        screenPoints: Array<{ x: number; y: number; z: number }>;
        avgZ: number;
        normal: [number, number, number];
        diffuseKey: number;
        diffuseFill: number;
        specular: number;
      }

      const renderableFaces: RenderableFace[] = [];

      faces.forEach((face) => {
        const v0 = transformedVertices[face.indices[0]];
        const v1 = transformedVertices[face.indices[1]];
        const v2 = transformedVertices[face.indices[2]];

        // Vectores en el espacio 3D rotado
        const ax = v1.wx - v0.wx;
        const ay = v1.wy - v0.wy;
        const az = v1.wz - v0.wz;
        const bx = v2.wx - v0.wx;
        const by = v2.wy - v0.wy;
        const bz = v2.wz - v0.wz;

        // Vector normal 3D: A x B
        const nx = ay * bz - az * by;
        const ny = az * bx - ax * bz;
        const nz = ax * by - ay * bx;

        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        const normal: [number, number, number] = [nx / len, ny / len, nz / len];

        // Backface Culling: Si la normal apunta hacia atrás (nz <= 0.02), omitir cara
        if (normal[2] <= 0.02) return;

        // Iluminación Direccional (Key Light)
        const dotKey = normal[0] * keyLight[0] + normal[1] * keyLight[1] + normal[2] * keyLight[2];
        const diffuseKey = Math.max(0, dotKey);

        // Iluminación de Rebote Verde Menta (Fill Light)
        const dotFill = normal[0] * fillLight[0] + normal[1] * fillLight[1] + normal[2] * fillLight[2];
        const diffuseFill = Math.max(0, dotFill);

        // Reflejo Especular Blinn-Phong
        const dotHalf = normal[0] * halfVector[0] + normal[1] * halfVector[1] + normal[2] * halfVector[2];
        const specular = Math.pow(Math.max(0, dotHalf), 22);

        // Profundidad promedio para ordenamiento del pintor
        let sumZ = 0;
        const screenPoints = face.indices.map((idx) => {
          sumZ += transformedVertices[idx].z;
          return transformedVertices[idx];
        });
        const avgZ = sumZ / face.indices.length;

        renderableFaces.push({
          face,
          screenPoints,
          avgZ,
          normal,
          diffuseKey,
          diffuseFill,
          specular,
        });
      });

      // Ordenar de atrás hacia adelante
      renderableFaces.sort((a, b) => a.avgZ - b.avgZ);

      // 4. RENDERIZAR CARAS CON DEGRADADOS VOLUMÉTRICOS Y TONALIDAD COHERENTE
      renderableFaces.forEach(({ face, screenPoints, diffuseKey, diffuseFill, specular }) => {
        if (screenPoints.length < 3) return;

        // Síntesis de color basada en la paleta:
        // Base oscura: pizarra verde #222E26
        // Contribución clave: alumbra hacia verde lima cálido
        // Contribución relleno: alumbra hacia verde menta #78BFA1
        // Especular: brillo nítido lima suave #B8E986
        const ambient = 0.55;
        const rLit = face.baseR * (ambient + diffuseKey * 0.75) + 35 * diffuseFill + 184 * specular * 0.5;
        const gLit = face.baseG * (ambient + diffuseKey * 0.95) + 70 * diffuseFill + 233 * specular * 0.6;
        const bLit = face.baseB * (ambient + diffuseKey * 0.65) + 55 * diffuseFill + 134 * specular * 0.45;

        // Lado más en penumbra del gradiente
        const rDark = face.baseR * (ambient * 0.8) + 10 * diffuseFill;
        const gDark = face.baseG * (ambient * 0.8) + 20 * diffuseFill;
        const bDark = face.baseB * (ambient * 0.8) + 15 * diffuseFill;

        const r1 = Math.min(255, Math.floor(rLit));
        const g1 = Math.min(255, Math.floor(gLit));
        const b1 = Math.min(255, Math.floor(bLit));

        const r0 = Math.min(255, Math.floor(rDark));
        const g0 = Math.min(255, Math.floor(gDark));
        const b0 = Math.min(255, Math.floor(bDark));

        // Gradiente lineal a lo largo de la cara según la orientación de la luz
        const p0 = screenPoints[0];
        const pLast = screenPoints[screenPoints.length - 1];
        const grad = ctx.createLinearGradient(p0.x, p0.y, pLast.x, pLast.y);
        grad.addColorStop(0, `rgb(${r1}, ${g1}, ${b1})`);
        grad.addColorStop(1, `rgb(${r0}, ${g0}, ${b0})`);

        ctx.beginPath();
        ctx.moveTo(screenPoints[0].x, screenPoints[0].y);
        for (let i = 1; i < screenPoints.length; i++) {
          ctx.lineTo(screenPoints[i].x, screenPoints[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = grad;
        ctx.fill();

        // 5. TRAZADO DE ARISTAS ARQUITECTÓNICAS BISELADAS
        // Las aristas iluminadas brillan con acento lima/menta; las sombreadas tienen trazo sobrio
        const edgeGlow = Math.min(0.7, 0.15 + diffuseKey * 0.35 + specular * 0.4);
        ctx.strokeStyle = `rgba(184, 233, 134, ${edgeGlow})`;
        ctx.lineWidth = 1.1;
        ctx.lineJoin = 'round';
        ctx.stroke();
      });

      // 6. MICRO-NODOS ARQUITECTÓNICOS EN VÉRTICES FRONTALES
      // Destaca la precisión estructural como en un visor CAD de diseño paramétrico
      transformedVertices.forEach((v) => {
        if (v.z > 0.1) {
          const nodeAlpha = Math.min(0.65, (v.z / 1.5) * 0.5 + 0.15);
          ctx.beginPath();
          ctx.arc(v.x, v.y, 1.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(184, 233, 134, ${nodeAlpha})`;
          ctx.fill();
        }
      });

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div
      className={`brikken-3d-sculpture-wrapper ${className}`}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <canvas
        ref={canvasRef}
        className="brikken-3d-canvas"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
});

ArchitecturalShape.displayName = 'ArchitecturalShape';

export default ArchitecturalShape;
