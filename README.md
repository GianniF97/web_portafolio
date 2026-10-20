# Portafolio Profesional Interactivo — Desarrollador en Formación

Portafolio personal desarrollado con **React 18**, **TypeScript**, **Vite** y **CSS moderno con variables de diseño**, enfocado en identidad editorial técnica, rendimiento web, diseño *mobile-first* (`320px` a `1440px`), accesibilidad **WCAG 2.2 AA** y **SEO semántico**.

> El archivo original [`calculo.py`](./calculo.py) (Generador de Contraseñas en Python + Tkinter) se conserva intacto en la raíz del directorio y cuenta con una demostración interactiva integrada en la galería de proyectos.

---

## 1. Cómo ejecutar el proyecto localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Comprobar tipos de TypeScript
npm run typecheck

# 4. Generar versión optimizada para producción (carpeta dist/)
npm run build

# 5. Previsualizar compilación de producción
npm run preview
```

---

## 2. Dónde editar tus datos personales

Toda la información del sitio está centralizada en un único archivo fuertemente tipado:

- **[`src/data/portfolioData.ts`](./src/data/portfolioData.ts)**

En el objeto `personalProfile` puedes actualizar:
- `name`: Tu nombre completo.
- `brandMark`: El identificador corto que aparece en la barra de navegación y el pie de página.
- `location` y `availabilityText`: Tu ciudad/país y disponibilidad actual.
- `contact.email`: Tu correo electrónico real (y cambiar `isEmailPlaceholder: false` para ocultar el aviso de configuración).
- `contact.githubUrl`, `contact.linkedinUrl` y `contact.cvUrl`: Tus enlaces profesionales reales.
- `canonicalSiteUrl`: Tu dominio definitivo cuando publiques la web (ej. `https://tudominio.dev`).

---

## 3. Cómo incorporar nuevos proyectos y tecnologías

1. **Agregar o editar proyectos (`projectsData` en `src/data/portfolioData.ts`):**
   - Coloca la captura de pantalla optimizada (preferentemente `.webp`, `.avif` o `.svg`) en `public/projects/`.
   - Añade un nuevo objeto al arreglo `projectsData` indicando `title`, `problem`, `goal`, `technologies`, `status` (`'Terminado' | 'En desarrollo' | 'Experimental'`), `isDemo: false`, `demoUrl` y `repoUrl`.
   - Puedes eliminar o editar las tarjetas marcadas con `isDemo: true`.

2. **Agregar o modificar tecnologías (`technologiesData` en `src/data/portfolioData.ts`):**
   - Cada tecnología pertenece a una categoría (`'lenguajes' | 'frontend' | 'backend' | 'bases-de-datos' | 'herramientas'`).
   - Define su etapa honesta en `stage`: `'Práctica activa'` o `'En aprendizaje'`.

3. **Bitácora técnica (`learningLogData` en `src/data/portfolioData.ts`):**
   - Agrega nuevas entradas al arreglo `learningLogData`.
   - Si prefieres no mostrar la sección de bitácora, deja el arreglo vacío (`export const learningLogData: LearningLogEntry[] = []`) y tanto la sección como su enlace en el menú desaparecerán automáticamente.
