import React, { useEffect, useRef, memo } from 'react';

/**
 * Escultura arquitectónica geométrica tridimensional
 * Reproduce el objeto escultórico central de Brikken+Co (concrete 3D shape)
 * mediante Canvas 2D de alto rendimiento con rotación suave en 3D,
 * sombreado facetado con la paleta marfil/verde, y respuesta al scroll y al cursor.
 */
export const ArchitecturalShape: React.FC<{ className?: string }> = memo(({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let angleX = 0.4;
    let angleY = 0.6;
    let targetAngleX = 0.4;
    let targetAngleY = 0.6;
    let scrollYOffset = 0;

    // Vértices de un prisma poliédrico arquitectónico estilizado (estilo escultura de concreto)
    const vertices = [
      [-1, -1.2, -0.8],
      [1, -1.2, -0.8],
      [1.3, 0.2, -0.8],
      [-1.3, 0.2, -0.8],
      [-0.8, -1.4, 0.8],
      [0.8, -1.4, 0.8],
      [1.1, 1.3, 0.8],
      [-1.1, 1.3, 0.8],
      [0, 1.8, 0],
      [0, -1.8, 0],
    ];

    // Caras poligonales con índices de vértices
    const faces = [
      { v: [0, 1, 2, 3], baseColor: [229, 232, 223] }, // cara posterior
      { v: [4, 5, 6, 7], baseColor: [244, 241, 232] }, // cara frontal
      { v: [0, 4, 7, 3], baseColor: [120, 134, 106] }, // cara lateral izquierda
      { v: [1, 5, 6, 2], baseColor: [210, 213, 202] }, // cara lateral derecha
      { v: [9, 0, 1], baseColor: [244, 241, 232] },    // facetado superior
      { v: [9, 4, 5], baseColor: [229, 232, 223] },
      { v: [8, 6, 7], baseColor: [65, 76, 60] },       // facetado inferior
      { v: [8, 2, 3], baseColor: [105, 110, 100] },
      { v: [0, 9, 4], baseColor: [120, 134, 106] },
      { v: [1, 9, 5], baseColor: [210, 213, 202] },
      { v: [3, 8, 7], baseColor: [65, 76, 60] },
      { v: [2, 8, 6], baseColor: [120, 134, 106] },
    ];

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const nx = (e.clientX / innerWidth) * 2 - 1;
      const ny = (e.clientY / innerHeight) * 2 - 1;
      targetAngleY = 0.6 + nx * 0.45;
      targetAngleX = 0.4 + ny * 0.35;
    };

    const handleScroll = () => {
      scrollYOffset = window.scrollY || window.pageYOffset;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Configuración DPI y render loop
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Suavizado e interpolación de rotación con scroll
      const scrollRotation = scrollYOffset * 0.0022;
      angleX += (targetAngleX + scrollRotation * 0.5 - angleX) * 0.05;
      angleY += (targetAngleY + scrollRotation - angleY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      const scale = Math.min(width, height) * 0.28;
      const cx = width / 2;
      const cy = height / 2;

      // Transformación 3D de vértices
      const projected = vertices.map(([x, y, z]) => {
        // Rotación en Y
        const x1 = x * cosY - z * sinY;
        const z1 = z * cosY + x * sinY;

        // Rotación en X
        const y2 = y * cosX - z1 * sinX;
        const z2 = z1 * cosX + y * sinX;

        // Proyección en perspectiva
        const fov = 3.2;
        const pz = z2 + fov;
        const px = (x1 / pz) * scale + cx;
        const py = (y2 / pz) * scale + cy;

        return { x: px, y: py, z: z2 };
      });

      // Ordenar caras por profundidad (algoritmo del pintor)
      const sortedFaces = faces
        .map((face) => {
          let zSum = 0;
          face.v.forEach((idx) => {
            zSum += projected[idx].z;
          });
          const avgZ = zSum / face.v.length;

          // Cálculo del vector normal para sombreado direccional
          const p0 = projected[face.v[0]];
          const p1 = projected[face.v[1]];
          const p2 = projected[face.v[2]];
          const vax = p1.x - p0.x;
          const vay = p1.y - p0.y;
          const vbx = p2.x - p0.x;
          const vby = p2.y - p0.y;
          const normalZ = vax * vby - vay * vbx;

          return { face, avgZ, normalZ };
        })
        .filter((item) => item.normalZ > 0) // Backface culling
        .sort((a, b) => a.avgZ - b.avgZ);

      // Dibujar caras con sombreado de textura arquitectónica
      sortedFaces.forEach(({ face, normalZ }) => {
        const poly = face.v.map((idx) => projected[idx]);
        const lightIntensity = Math.min(1.2, Math.max(0.45, (normalZ / 12000) + 0.6));
        const [r, g, b] = face.baseColor.map((c) => Math.min(255, Math.floor(c * lightIntensity)));

        ctx.beginPath();
        ctx.moveTo(poly[0].x, poly[0].y);
        for (let i = 1; i < poly.length; i++) {
          ctx.lineTo(poly[i].x, poly[i].y);
        }
        ctx.closePath();

        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        ctx.fill();

        // Aristas arquitectónicas nítidas estilo Brikken
        ctx.strokeStyle = 'rgba(37, 41, 35, 0.15)';
        ctx.lineWidth = 1.25;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className={`brikken-3d-sculpture-wrapper ${className}`} aria-hidden="true">
      <canvas
        ref={canvasRef}
        className="brikken-3d-canvas"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
});

ArchitecturalShape.displayName = 'ArchitecturalShape';

export default ArchitecturalShape;
