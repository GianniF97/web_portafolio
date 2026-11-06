/**
 * ============================================================================
 * ARCHIVO CENTRAL DE CONFIGURACIÓN DEL PORTAFOLIO — GIANNI FERRARI
 * ============================================================================
 * Portafolio profesional de Gianni Alessandro Ferrari (@GianniF97)
 * Analista de Sistemas & Software Developer.
 */

export type ProjectStatus = 'Terminado' | 'En desarrollo' | 'Experimental';

export type ProjectLayoutVariant = 'featured-split' | 'editorial-card' | 'technical-compact';

export interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  /** Etiqueta editorial breve (ej. "Gestión industrial") */
  category: string;
  /** Descripción clara del problema real que aborda el proyecto */
  problem: string;
  /** Objetivo técnico y de aprendizaje al construirlo */
  goal: string;
  /** Decisiones técnicas o puntos clave de la implementación */
  highlights: string[];
  technologies: string[];
  status: ProjectStatus;
  /** Indica si es contenido de demostración (false para proyectos reales del autor) */
  isDemo: boolean;
  layoutVariant: ProjectLayoutVariant;
  image: {
    src: string;
    alt: string;
    /**
     * true mientras la imagen sea una ilustración y no una captura real.
     * Reemplazar el archivo en /public/projects por una captura (WebP/AVIF) y poner false.
     */
    isIllustration?: boolean;
    width: number;
    height: number;
  };
  /** Dejar vacío ("") si aún no tiene demo publicada */
  demoUrl?: string;
  /** URL al repositorio en GitHub */
  repoUrl?: string;
  /** Ruta local o referencia del repositorio */
  sourceFileHint?: string;
}

export type TechCategoryId =
  | 'backend'
  | 'bases-de-datos'
  | 'lenguajes'
  | 'frontend'
  | 'herramientas';

export type LearningStage = 'Práctica activa' | 'En aprendizaje';

export interface TechItem {
  id: string;
  name: string;
  category: TechCategoryId;
  stage: LearningStage;
  /** Contexto honesto de cómo utilizas o estás estudiando esta tecnología */
  context: string;
  /** Identificador del icono SVG consistente */
  iconKey:
    | 'python'
    | 'typescript'
    | 'javascript'
    | 'react'
    | 'html-css'
    | 'tkinter'
    | 'node'
    | 'sql'
    | 'git'
    | 'vscode'
    | 'vite'
    | 'flask'
    | 'php'
    | 'postgresql'
    | 'mysql'
    | 'streamlit'
    | 'linux'
    | 'security'
    | 'vercel'
    | 'database'
    | 'placeholder';
  isPlaceholder?: boolean;
}

export interface TechCategory {
  id: TechCategoryId;
  title: string;
  codeLabel: string;
  description: string;
}

export type LogEntryCategory =
  | 'Proyecto personal'
  | 'Nuevo concepto'
  | 'Experimento técnico'
  | 'Mejora iterativa';

export interface LearningLogEntry {
  id: string;
  stageLabel: string;
  category: LogEntryCategory;
  title: string;
  summary: string;
  takeaway: string;
  tags: string[];
  isTemplate: boolean;
}

export interface HeadlineLine {
  text: string;
  /** Palabra destacada en serif itálica al final de la línea */
  emphasis?: string;
  /** Desplaza la línea hacia la derecha en pantallas medianas y grandes */
  indent?: boolean;
}

export interface PersonalProfile {
  name: string;
  brandMark: string;
  roleTag: string;
  location: string;
  /** Zona horaria IANA para la hora local que se muestra en el hero */
  timeZone: string;
  timeZoneLabel: string;
  githubHandle: string;
  avatarUrl: string;
  availabilityText: string;
  focusAreas: string[];
  canonicalSiteUrl: string;
  hero: {
    label: string;
    headlineLines: HeadlineLine[];
    lead: string;
    primaryCtaText: string;
    secondaryCtaText: string;
  };
  about: {
    education: string;
    quote: string;
    introParagraph: string;
    whoIAm: string;
    whatILearn: string;
    whatIBuild: string;
    howISolveProblems: string;
    whatIImprove: string;
    workingPrinciples: Array<{
      index: string;
      title: string;
      description: string;
    }>;
  };
  contact: {
    headline: string;
    description: string;
    email: string;
    isEmailPlaceholder: boolean;
    githubUrl: string;
    linkedinUrl: string;
    cvUrl: string;
    otherLinks: Array<{
      label: string;
      url: string;
    }>;
  };
}

export const personalProfile: PersonalProfile = {
  name: 'Gianni Alessandro Ferrari',
  brandMark: 'gianni.ferrari',
  roleTag: 'Analista de Sistemas & Software Developer',
  location: 'Argentina',
  timeZone: 'America/Argentina/Buenos_Aires',
  timeZoneLabel: 'GMT-3',
  githubHandle: '@GianniF97',
  avatarUrl: 'https://avatars.githubusercontent.com/u/112982621?v=4',
  availabilityText: 'Disponible para desarrollo de software, pasantías y colaboraciones técnicas',
  focusAreas: [
    'Desarrollo Backend & APIs (Python, Flask, PHP)',
    'Modelado y Gestión de Bases de Datos Relacionales (PostgreSQL, MySQL)',
    'Desarrollo Web Frontend (React, TypeScript, CSS Moderno)',
    'Seguridad Informática (Hardening & Buenas Prácticas)',
  ],
  canonicalSiteUrl: 'https://gianniaferrari.web.app',
  hero: {
    label: 'Desarrollador en formación',
    headlineLines: [
      { text: 'Sistemas pensados' },
      { text: 'desde los ', emphasis: 'datos', indent: true },
      { text: 'hasta la interfaz.' },
    ],
    lead: 'Soy Gianni, estudiante avanzado de Analista de Sistemas en Argentina. Construyo aplicaciones web y sistemas de gestión con Python, Flask y bases de datos relacionales, y hoy sigo aprendiendo React y TypeScript con proyectos como este sitio.',
    primaryCtaText: 'Ver proyectos',
    secondaryCtaText: 'Contactar',
  },
  about: {
    education: 'Analista de Sistemas · estudiante avanzado',
    quote:
      'Un esquema de datos coherente evita errores que, más adelante, parecen problemas de código.',
    introParagraph:
      'Soy Gianni Alessandro Ferrari, estudiante avanzado de Analista de Sistemas. Me interesa entender cómo funciona un sistema de punta a punta: cómo se modelan los datos, cómo se organiza el backend y cómo llega todo eso a una interfaz que se pueda usar sin fricción.',
    whoIAm:
      'Trabajo principalmente con Python, Flask y bases de datos relacionales, complementado con desarrollo frontend moderno. Mis proyectos más destacados integran sistemas de gestión industrial (control de aserradero) y aplicaciones web en producción como la plataforma de streaming Radio Gravity y la web institucional de Biofuego desplegados en la nube.',
    whatILearn:
      'Hoy estoy profundizando en React y TypeScript —este sitio es parte de esa práctica—, en modelado relacional y en buenas prácticas de seguridad aplicadas al desarrollo web.',
    whatIBuild:
      'Me gusta construir herramientas concretas: registrar, calcular, controlar estados y mostrar la información de forma clara.',
    howISolveProblems:
      'Antes de programar intento entender el problema y diseñar el modelo de datos. Después construyo en partes pequeñas que pueda probar, prestando atención a las validaciones y a los casos borde.',
    whatIImprove:
      'Con cada proyecto busco escribir código más legible, separar mejor las responsabilidades y optimizar las consultas a la base de datos.',
    workingPrinciples: [
      {
        index: '01',
        title: 'Primero, el modelo de datos',
        description:
          'Un esquema relacional coherente y normalizado evita muchos errores lógicos antes de escribir la primera pantalla.',
      },
      {
        index: '02',
        title: 'Claridad antes que ingenio',
        description:
          'Código estructurado y fácil de leer, pensado para poder mantenerlo y modificarlo con el tiempo.',
      },
      {
        index: '03',
        title: 'Desconfiar de las entradas',
        description:
          'Validar y sanitizar datos, usar hashing y prevenir inyecciones como práctica habitual, no como agregado final.',
      },
      {
        index: '04',
        title: 'Resolver algo concreto',
        description:
          'El software tiene que responder a una necesidad real: interfaces simples, accesibles y rápidas.',
      },
    ],
  },
  contact: {
    headline: '¿Hablamos?',
    description:
      'Si hay un proyecto, una oportunidad o una pregunta sobre alguno de mis trabajos, el correo es la vía más directa. También estoy en GitHub y LinkedIn.',
    email: 'gianniferrari9789@gmail.com',
    isEmailPlaceholder: false,
    githubUrl: 'https://github.com/GianniF97',
    linkedinUrl: 'https://www.linkedin.com/in/gianni-ferrari-b71b07444/',
    cvUrl: '',
    otherLinks: [
      {
        label: 'Ver perfil GitHub (@GianniF97)',
        url: 'https://github.com/GianniF97',
      },
      {
        label: 'Perfil profesional en LinkedIn',
        url: 'https://www.linkedin.com/in/gianni-ferrari-b71b07444/',
      },
      {
        label: 'Radio Gravity (Web en vivo)',
        url: 'https://radiogravity.web.app',
      },
      {
        label: 'Biofuego (Web oficial)',
        url: 'https://biofuego.web.app',
      },
    ],
  },
};

/**
 * ============================================================================
 * PROYECTOS REALES DEL REPOSITORIO GITHUB DE GIANNI FERRARI (@GianniF97)
 * ============================================================================
 */
export const projectsData: ProjectItem[] = [
  {
    id: 'sistema-aserradero',
    title: 'Sistema de Gestión Integral de Aserradero',
    subtitle: 'Control de inventario de rollos en playón, órdenes de corte y trazabilidad industrial',
    problem:
      'La administración tradicional de rollos de madera y órdenes de corte en aserraderos genera inconsistencias en el stock, errores en el cálculo de cubicación geométrica y falta de trazabilidad en los remitos de despacho.',
    goal:
      'Desarrollar una aplicación web industrial en Python y Flask bajo arquitectura MVC, con base de datos relacional modelada formalmente mediante Diagrama Entidad-Relación (DER) y matriz de trazabilidad de requerimientos.',
    highlights: [
      'Modelado de base de datos relacional (db.py y crear_db.py) con restricciones de integridad referencial y trazabilidad de lotes.',
      'Algoritmo de cubicación geométrica para cálculo volumétrico exacto (m³) de rollos según especie forestal (Pino Taeda/Eliottis, Eucalipto Grandis).',
      'Flujo operativo completo: recepción en playón, corte en sierra principal y emisión de remitos internos de despacho.',
      'Documentación técnica formal de ingeniería de software con diagrama DER y matriz de trazabilidad de requerimientos en PDF.',
    ],
    category: 'Gestión industrial',
    technologies: ['Python 3', 'Flask (MVC)', 'SQL / DB Relacional', 'Modelado DER', 'HTML5 Semántico', 'CSS3'],
    status: 'Terminado',
    isDemo: false,
    layoutVariant: 'featured-split',
    image: {
      src: '/projects/aserradero-preview.svg',
      alt: 'Panel de control y cubicación de sistema_aserradero en Flask y DB relacional',
      isIllustration: true,
      width: 800,
      height: 500,
    },
    demoUrl: '',
    repoUrl: 'https://github.com/GianniF97/sistema_aserradero',
    sourceFileHint: 'github.com/GianniF97/sistema_aserradero',
  },
  {
    id: 'biofuego',
    title: 'Biofuego',
    subtitle: 'Página web institucional y plataforma de pedidos para iniciadores de fuego artesanales',
    problem:
      'Las marcas artesanales y ecológicas requieren una presencia digital profesional y de alto impacto visual para comunicar el origen sustentable de sus productos (100% aserrín de madera), presentar sus formatos y facilitar solicitudes directas de compra sin fricción.',
    goal:
      'Diseñar y desplegar una plataforma institucional moderna, fluida y responsiva para Biofuego, con animaciones de alto rendimiento (60-120 FPS), interactividad 3D en el hero, calculadora dinámica de pedidos y contacto directo vía WhatsApp y correo.',
    highlights: [
      'Despliegue activo y en producción en Firebase Hosting (https://biofuego.web.app) con tiempos de carga optimizados y diseño mobile-first.',
      'Experiencia interactiva con efecto de inclinación 3D (tilt) en el hero mediante requestAnimationFrame sin dependencias externas pesadas.',
      'Calculadora interactiva de pedidos en tiempo real con integración directa a la API de WhatsApp y plantillas automáticas de correo.',
      'Estructuración semántica SEO con microdatos Schema.org (JSON-LD), optimización de recursos y preloading de imágenes AVIF/WebP.',
    ],
    category: 'Web institucional',
    technologies: ['HTML5 Semántico', 'CSS3 Moderno', 'JavaScript ES6+', 'Firebase Hosting', 'Schema.org', 'Diseño Responsivo', 'WhatsApp API'],
    status: 'Terminado',
    isDemo: false,
    layoutVariant: 'editorial-card',
    image: {
      src: '/projects/biofuego-preview.webp',
      alt: 'Página web institucional de Biofuego — Iniciadores de fuego artesanales ecológicos',
      isIllustration: false,
      width: 1920,
      height: 1200,
    },
    demoUrl: 'https://biofuego.web.app',
    repoUrl: '',
    sourceFileHint: 'biofuego.web.app (Producción)',
  },
  {
    id: 'radiogravity',
    title: 'Radio Gravity',
    subtitle: 'Página web de radio online y Progressive Web App (PWA) con transmisión oficial en vivo 24/7',
    problem:
      'Las estaciones de radio digital habitualmente carecen de reproductores interactivos con respuesta visual en tiempo real, sufren de consumo excesivo de recursos y no ofrecen instalación fluida en dispositivos móviles.',
    goal:
      'Construir una plataforma web interactiva y Progressive Web App (PWA) para Radio Gravity con transmisión de audio continua en vivo (MP3/AAC), motor de análisis Web Audio API en tiempo real, visualizador 3D reactivo mediante Three.js y WebGL, y soporte de instalación nativa.',
    highlights: [
      'Transmisión oficial en vivo 24/7 desplegada en Firebase Hosting (https://radiogravity.web.app).',
      'Motor de audio dual con selector de calidad en tiempo real (MP3 compatible / AAC eficiente a 64k) y persistencia en LocalStorage.',
      'Visualizador 3D generativo y reactivo desarrollado con Three.js y WebGL, con adaptación a modo prefers-reduced-motion y ahorro de batería.',
      'Progressive Web App (PWA) completa con Service Worker, manifiesto web, guía modal de instalación para iOS/Android y modo standalone sin barras.',
    ],
    category: 'Streaming · PWA',
    technologies: ['Web Audio API', 'Three.js / WebGL', 'PWA & Service Worker', 'JavaScript ES6+', 'HTML5 Audio', 'CSS3 Cyberpunk', 'Firebase Hosting'],
    status: 'Terminado',
    isDemo: false,
    layoutVariant: 'editorial-card',
    image: {
      src: '/projects/radiogravity-preview.webp',
      alt: 'Plataforma de streaming interactiva y reproductor en vivo de Radio Gravity',
      isIllustration: false,
      width: 1920,
      height: 1200,
    },
    demoUrl: 'https://radiogravity.web.app',
    repoUrl: '',
    sourceFileHint: 'radiogravity.web.app (Producción)',
  },
  {
    id: 'programacion-cientifica-lab',
    title: 'Laboratorio de Programación Científica y Métodos Numéricos',
    subtitle: 'Algoritmos matemáticos, álgebra computacional y simulación numérica en Python',
    problem:
      'La resolución computacional de problemas matemáticos complejos y ecuaciones no lineales exige algoritmos con convergencia verificada, control de errores de redondeo y optimización de complejidad temporal.',
    goal:
      'Implementar, comprobar y documentar métodos numéricos (Newton-Raphson, matrices, integración por Simpson, interpolación) como parte de la formación avanzada en Ciencias de la Computación y Análisis de Sistemas.',
    highlights: [
      'Implementación de métodos de aproximación numérica con control estricto de tolerancia de error (tol < 1e-7).',
      'Estructuración algorítmica modular con tipado estático (typing) y pruebas de convergencia.',
      'Resolución de sistemas de ecuaciones lineales mediante eliminación Gaussiana y descomposición LU.',
      'Ajuste de curvas por mínimos cuadrados y polinomios interpoladores de Lagrange.',
    ],
    category: 'Computación científica',
    technologies: ['Python 3', 'Métodos Numéricos', 'Algoritmos', 'Álgebra Lineal', 'Computación Científica'],
    status: 'En desarrollo',
    isDemo: false,
    layoutVariant: 'technical-compact',
    image: {
      src: '/projects/programacion-cientifica-preview.svg',
      alt: 'Editor de métodos numéricos y gráfica de convergencia en Python',
      isIllustration: true,
      width: 800,
      height: 500,
    },
    demoUrl: '',
    repoUrl: 'https://github.com/GianniF97/Programacion_cientifica',
    sourceFileHint: 'github.com/GianniF97/Programacion_cientifica',
  },
  {
    id: 'sistema-gestion-cheques-core',
    title: 'Sistema de Gestión de Cheques (Core Backend en Python)',
    subtitle: 'Arquitectura fundacional en Python con persistencia y lógica contable',
    problem:
      'La etapa inicial de administración de valores financieros requería validar las reglas de negocio, cálculo de plazos de acreditación y clasificación de estados antes de su migración a la arquitectura web 2.0.',
    goal:
      'Diseñar e implementar el motor lógico y el modelo de datos en Python puro para la gestión de cheques en cartera, cálculo de intereses y estados de cobro.',
    highlights: [
      'Modelado modular de entidades financieras (cheques, bancos emisores, estados de cartera) con POO en Python.',
      'Algoritmo de cálculo de plazos para detección de proximidad de vencimiento y conciliación bancaria.',
      'Estructuración de persistencia modular y lógica desacoplada para control de estados contables.',
    ],
    category: 'Backend · Python',
    technologies: ['Python 3', 'POO', 'Lógica Financiera', 'Modelado de Datos', 'Control de Estados'],
    status: 'Terminado',
    isDemo: false,
    layoutVariant: 'technical-compact',
    image: {
      src: '/projects/cheques-preview.svg',
      alt: 'Estructura lógica de sistema-gestion-cheques en Python',
      isIllustration: true,
      width: 800,
      height: 500,
    },
    demoUrl: '',
    repoUrl: 'https://github.com/GianniF97/sistema-gestion-cheques',
    sourceFileHint: 'github.com/GianniF97/sistema-gestion-cheques',
  },
  {
    id: 'practicas-git-github-pp',
    title: 'Práctica Profesional de Git, GitHub & Arquitectura',
    subtitle: 'Flujos de trabajo colaborativos, branching y estándares de control de versiones',
    problem:
      'En entornos profesionales de desarrollo de software, la falta de convenciones en ramas y commits provoca desorden, conflictos difíciles de resolver y pérdida de trazabilidad en el código.',
    goal:
      'Estructurar y documentar flujos de trabajo estandarizados (GitFlow, feature branches, pull requests y semantic commit messages) en el marco de la Práctica Profesional de Sistemas.',
    highlights: [
      'Prácticas de versionado colaborativo y resolución metódica de conflictos.',
      'Estandarización de commits semánticos y documentación técnica de repositorios.',
      'Organización de proyectos y buenas prácticas de ingeniería de software.',
    ],
    category: 'Flujo de trabajo',
    technologies: ['Git', 'GitHub', 'Markdown', 'Branching Strategies', 'Ingeniería de Software'],
    status: 'Terminado',
    isDemo: false,
    layoutVariant: 'technical-compact',
    image: {
      src: '/projects/git-workflow-preview.svg',
      alt: 'Flujo de trabajo con Git y GitHub en ferrari-git-github-pp',
      isIllustration: true,
      width: 800,
      height: 500,
    },
    demoUrl: '',
    repoUrl: 'https://github.com/GianniF97/ferrari-git-github-pp',
    sourceFileHint: 'github.com/GianniF97/ferrari-git-github-pp',
  },
];

/**
 * ============================================================================
 * CATEGORÍAS Y STACK TECNOLÓGICO REAL DE GIANNI FERRARI
 * ============================================================================
 */
export const techCategories: TechCategory[] = [
  {
    id: 'backend',
    title: 'Backend & APIs',
    codeLabel: '01 // BACKEND_CORE',
    description: 'Desarrollo de servidores, arquitectura MVC, APIs REST y lógica de negocio orientada a sistemas.',
  },
  {
    id: 'bases-de-datos',
    title: 'Bases de datos & Modelado',
    codeLabel: '02 // DATA_STORAGE',
    description: 'Motores relacionales, diseño de diagramas Entidad-Relación (DER), normalización y consultas SQL.',
  },
  {
    id: 'lenguajes',
    title: 'Lenguajes de programación',
    codeLabel: '03 // LANGUAGES',
    description: 'Lenguajes base con los que resuelvo problemas algorítmicos y estructuro aplicaciones de software.',
  },
  {
    id: 'frontend',
    title: 'Frontend & UI',
    codeLabel: '04 // FRONTEND_UI',
    description: 'Construcción de interfaces web semánticas, responsivas, interactivas y accesibles.',
  },
  {
    id: 'herramientas',
    title: 'Herramientas, Cloud & Seguridad',
    codeLabel: '05 // TOOLING_SECURITY',
    description: 'Control de versiones, despliegue en la nube, hardening de sistemas y entornos de desarrollo.',
  },
];

export const technologiesData: TechItem[] = [
  // 1. Backend & APIs
  {
    id: 'python-backend',
    name: 'Python',
    category: 'backend',
    stage: 'Práctica activa',
    context: 'Desarrollo backend con Flask, Streamlit, scripts de automatización, lógica de negocio y programación científica.',
    iconKey: 'python',
  },
  {
    id: 'flask',
    name: 'Flask',
    category: 'backend',
    stage: 'Práctica activa',
    context: 'Construcción de aplicaciones web bajo arquitectura MVC, APIs REST, manejo de sesiones y plantillas Jinja2 en sistemas de gestión.',
    iconKey: 'flask',
  },
  {
    id: 'php',
    name: 'PHP',
    category: 'backend',
    stage: 'Práctica activa',
    context: 'Desarrollo web backend, conexión con motores relacionales MySQL y arquitectura de software orientada a la web.',
    iconKey: 'php',
  },
  {
    id: 'streamlit',
    name: 'Streamlit',
    category: 'backend',
    stage: 'Práctica activa',
    context: 'Creación rápida de dashboards analíticos e interfaces de datos interactivas en Python.',
    iconKey: 'streamlit',
  },
  {
    id: 'vercel-serverless',
    name: 'Vercel Serverless',
    category: 'backend',
    stage: 'Práctica activa',
    context: 'Despliegue de funciones serverless en Python, hosting de aplicaciones en producción y pipelines CI/CD.',
    iconKey: 'vercel',
  },

  // 2. Bases de Datos & Modelado
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'bases-de-datos',
    stage: 'Práctica activa',
    context: 'Bases de datos relacionales robustas, consultas complejas, índices, restricciones y transacciones ACID.',
    iconKey: 'postgresql',
  },
  {
    id: 'mysql',
    name: 'MySQL / MariaDB',
    category: 'bases-de-datos',
    stage: 'Práctica activa',
    context: 'Modelado relacional, integridad referencial y diseño de esquemas optimizados para sistemas de gestión.',
    iconKey: 'mysql',
  },
  {
    id: 'modelado-der-sql',
    name: 'Modelado DER & SQL',
    category: 'bases-de-datos',
    stage: 'Práctica activa',
    context: 'Diagramas Entidad-Relación (DER), normalización de tablas, matrices de trazabilidad y lenguaje SQL nativo.',
    iconKey: 'database',
  },

  // 3. Lenguajes de programación
  {
    id: 'python-lang',
    name: 'Python 3',
    category: 'lenguajes',
    stage: 'Práctica activa',
    context: 'Programación orientada a objetos, métodos numéricos, estructuras de datos y manipulación de archivos.',
    iconKey: 'python',
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    category: 'lenguajes',
    stage: 'Práctica activa',
    context: 'Manipulación del DOM, consumo de APIs REST, programación asíncrona y lógica interactiva en el navegador.',
    iconKey: 'javascript',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'lenguajes',
    stage: 'En aprendizaje',
    context: 'Tipado estático riguroso, definición de contratos de datos para componentes y prevención de errores en compilación.',
    iconKey: 'typescript',
  },

  // 4. Frontend & UI
  {
    id: 'html-css',
    name: 'HTML & CSS',
    category: 'frontend',
    stage: 'Práctica activa',
    context: 'Maquetación mobile-first con CSS Grid, Flexbox, variables nativas (Custom Properties), atención a la accesibilidad y animaciones con CSS.',
    iconKey: 'html-css',
  },
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    stage: 'En aprendizaje',
    context: 'Componentes funcionales, manejo de estado con hooks (useState, useEffect, useMemo) y desacoplamiento de arquitectura.',
    iconKey: 'react',
  },
  {
    id: 'vite',
    name: 'Vite',
    category: 'frontend',
    stage: 'Práctica activa',
    context: 'Entorno de desarrollo ágil con recarga ultrarrápida (HMR) y compilación optimizada para producción.',
    iconKey: 'vite',
  },

  // 5. Herramientas, Cloud & Seguridad
  {
    id: 'git-github',
    name: 'Git & GitHub',
    category: 'herramientas',
    stage: 'Práctica activa',
    context: 'Flujos de trabajo con ramas (feature branches), pull requests, resolución de conflictos y 9 repositorios públicos activos.',
    iconKey: 'git',
  },
  {
    id: 'seguridad-hardening',
    name: 'Seguridad & hardening',
    category: 'herramientas',
    stage: 'En aprendizaje',
    context: 'Seguridad defensiva y ofensiva, sanitización estricta de inputs, hardening de sistemas y buenas prácticas de protección de datos.',
    iconKey: 'security',
  },
  {
    id: 'vscode-linux',
    name: 'VS Code & Linux',
    category: 'herramientas',
    stage: 'Práctica activa',
    context: 'Entorno de desarrollo diario en terminal bash/zsh, depuración de código, empaquetado y control de procesos.',
    iconKey: 'linux',
  },
];

/**
 * ============================================================================
 * BITÁCORA TÉCNICA / PROCESO DE APRENDIZAJE REAL
 * ============================================================================
 */
export const learningLogData: LearningLogEntry[] = [
  {
    id: 'log-aserradero-der',
    stageLabel: 'Sistemas de Gestión · Ingeniería de Requerimientos',
    category: 'Proyecto personal',
    title: 'Modelado Entidad-Relación y trazabilidad en el control de aserradero',
    summary:
      'Al diseñar sistema_aserradero en Python/Flask, la clave para evitar pérdidas de stock fue estructurar un Diagrama Entidad-Relación formal (DER) que vincula lotes de rollos, órdenes de corte en sierra y remitos de despacho con una matriz de trazabilidad.',
    takeaway:
      'Modelar formalmente la base de datos relacional y las restricciones de integridad referencial antes de escribir código visual previene inconsistencias lógicas en producción.',
    tags: ['Python', 'Flask', 'SQL', 'Modelado DER', 'Trazabilidad'],
    isTemplate: false,
  },
  {
    id: 'log-streaming-audio-pwa',
    stageLabel: 'Streaming Digital & PWA',
    category: 'Proyecto personal',
    title: 'Análisis de audio en tiempo real y arquitectura PWA en Radio Gravity',
    summary:
      'Al desarrollar radiogravity.web.app, el desafío principal fue procesar el flujo de audio continuo mediante Web Audio API y alimentar un osciloscopio 3D en Three.js manteniendo 60 FPS estables y bajo consumo de batería.',
    takeaway:
      'Combinar Web Workers, analizadores FFT ligeros y renderizado condicional en WebGL permite experiencias audiovisuales fluidas sin sobrecargar dispositivos móviles.',
    tags: ['Web Audio API', 'Three.js', 'PWA', 'JavaScript', 'Firebase'],
    isTemplate: false,
  },
  {
    id: 'log-programacion-cientifica',
    stageLabel: 'Programación Científica & Álgebra Computacional',
    category: 'Experimento técnico',
    title: 'Análisis de convergencia y control de error en métodos numéricos en Python',
    summary:
      'Al implementar algoritmos de aproximación en Python (como Newton-Raphson y resolución de matrices), el desafío central fue establecer un criterio riguroso de tolerancia residual (tol < 1e-7) y controlar los puntos críticos con derivadas nulas.',
    takeaway:
      'En computación científica, verificar la convergencia matemática y manejar divisiones por cero previene bucles infinitos y asegura estabilidad numérica.',
    tags: ['Python 3', 'Métodos Numéricos', 'Algoritmos', 'Convergencia'],
    isTemplate: false,
  },
  {
    id: 'log-arquitectura-frontend-ts',
    stageLabel: 'Desarrollo Web Frontend Moderno',
    category: 'Nuevo concepto',
    title: 'Contratos de tipos estrictos y diseño desacoplado en React + TypeScript',
    summary:
      'Estructuración de este portafolio mediante contratos de datos tipados (portfolioData.ts) separados de la capa visual, con foco en accesibilidad y rendimiento mobile-first, sin librerías externas pesadas.',
    takeaway:
      'Mantener los datos centralizados y tipados permite añadir proyectos o actualizar el stack sin tocar los componentes visuales.',
    tags: ['TypeScript', 'React', 'CSS Moderno', 'Accesibilidad', 'Mobile-First'],
    isTemplate: false,
  },
];
