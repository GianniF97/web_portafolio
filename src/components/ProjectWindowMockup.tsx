import React, { useState } from 'react';
import type { ProjectItem } from '../data/portfolioData';
import { ArrowUpRightIcon } from './Icons';

interface ProjectWindowMockupProps {
  project: ProjectItem;
}

type WindowTabId = 'inicio' | 'flujo' | 'tecnico' | 'movil';

const PROJECT_FLOW_STEPS: Record<string, Array<{ title: string; detail: string }>> = {
  'sistema-aserradero': [
    { title: 'Recepción en playón', detail: 'Alta de rollos por especie forestal y lote.' },
    { title: 'Cubicación geométrica', detail: 'Cálculo volumétrico exacto en m³.' },
    { title: 'Orden de corte', detail: 'Asignación a sierra principal y trazabilidad.' },
    { title: 'Remito de despacho', detail: 'Emisión y control de stock saliente.' },
  ],
  biofuego: [
    { title: 'Presentación institucional', detail: 'Origen sustentable y aserrín 100% madera.' },
    { title: 'Catálogo de formatos', detail: 'Detalle de presentaciones y rendimiento.' },
    { title: 'Calculadora dinámica', detail: 'Estimación interactiva de cantidades.' },
    { title: 'Pedido directo', detail: 'Integración a WhatsApp y correo electrónico.' },
  ],
  radiogravity: [
    { title: 'Transmisión continua', detail: 'Stream dual MP3 compatible y AAC 64k.' },
    { title: 'Web Audio API', detail: 'Análisis de frecuencias en tiempo real.' },
    { title: 'Visualizador WebGL', detail: 'Gráficos 3D reactivos con Three.js.' },
    { title: 'Soporte PWA', detail: 'Service Worker e instalación en iOS y Android.' },
  ],
  'programacion-cientifica-lab': [
    { title: 'Definición de entradas', detail: 'Funciones, matrices y valores iniciales.' },
    { title: 'Métodos iterativos', detail: 'Newton-Raphson, LU, Simpson y Lagrange.' },
    { title: 'Control de error', detail: 'Validación estricta con tol < 1e-7.' },
    { title: 'Verificación', detail: 'Pruebas de estabilidad y convergencia.' },
  ],
  'sistema-gestion-cheques-core': [
    { title: 'Modelado POO', detail: 'Entidades de cheques, bancos y titulares.' },
    { title: 'Cálculo de plazos', detail: 'Días restantes a fecha de acreditación.' },
    { title: 'Conciliación', detail: 'Validación de movimientos y vencimientos.' },
    { title: 'Control de cartera', detail: 'Transiciones de estado contable.' },
  ],
  'practicas-git-github-pp': [
    { title: 'Estrategia de ramas', detail: 'Flujo GitFlow y feature branches aisladas.' },
    { title: 'Commits semánticos', detail: 'Historial legible y trazable por cambio.' },
    { title: 'Resolución de conflictos', detail: 'Rebase y merge ordenados en equipo.' },
    { title: 'Pull Requests', detail: 'Revisión de código y documentación.' },
  ],
};

const TABS: Array<{ id: WindowTabId; label: string }> = [
  { id: 'inicio', label: 'Vista' },
  { id: 'flujo', label: 'Arquitectura' },
  { id: 'tecnico', label: 'Especificación' },
  { id: 'movil', label: 'Móvil' },
];

export const ProjectWindowMockup: React.FC<ProjectWindowMockupProps> = ({ project }) => {
  const [activeTab, setActiveTab] = useState<WindowTabId>('inicio');
  const flowSteps = PROJECT_FLOW_STEPS[project.id] ?? [];
  const primaryHref = project.demoUrl || project.repoUrl;
  const addressLabel =
    project.sourceFileHint ||
    (project.demoUrl ? project.demoUrl.replace(/^https?:\/\//, '') : project.id);

  return (
    <div className="studio-pj-window">
      <div className="studio-pj-bar">
        <span className="studio-pj-bar-ref" title={addressLabel}>
          {addressLabel}
        </span>

        <div
          className="studio-pj-tabs"
          role="tablist"
          aria-label={`Vistas interactivas de ${project.title}`}
        >
          {TABS.map((tab) => {
            const isSelected = activeTab === tab.id;
            const tabId = `tab-${project.id}-${tab.id}`;
            const panelId = `panel-${project.id}-${tab.id}`;
            return (
              <button
                key={tab.id}
                id={tabId}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-controls={panelId}
                className={`studio-pj-tab ${isSelected ? 'is-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {primaryHref ? (
          <a
            href={primaryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-chrome-ext-link"
            aria-label={`Abrir ${project.title} en nueva pestaña`}
            title={addressLabel}
          >
            <ArrowUpRightIcon size={13} />
          </a>
        ) : (
          <span className="studio-chrome-spacer" aria-hidden="true" />
        )}
      </div>

      <div
        className="studio-pj-screen"
        data-cursor-label={
          project.demoUrl ? 'Visitar sitio ↗' : project.repoUrl ? 'Explorar código ↗' : undefined
        }
      >
        {activeTab === 'inicio' && (
          <div
            id={`panel-${project.id}-inicio`}
            role="tabpanel"
            aria-labelledby={`tab-${project.id}-inicio`}
            className="studio-tab-panel studio-tab-panel-media"
          >
            <img
              src={project.image.src}
              alt={project.image.alt}
              width={project.image.width}
              height={project.image.height}
              loading="lazy"
              decoding="async"
              className="studio-preview-img"
            />
          </div>
        )}

        {activeTab === 'flujo' && (
          <div
            id={`panel-${project.id}-flujo`}
            role="tabpanel"
            aria-labelledby={`tab-${project.id}-flujo`}
            className="studio-tab-panel studio-tab-panel-flow"
          >
            <div className="studio-panel-heading-bar">
              <span className="studio-panel-kicker">Objetivo del sistema</span>
              <p className="studio-panel-goal">{project.goal}</p>
            </div>
            <div className="studio-flow-grid">
              {flowSteps.map((step) => (
                <div key={step.title} className="studio-flow-step">
                  <strong className="studio-flow-step-title">{step.title}</strong>
                  <span className="studio-flow-step-desc">{step.detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tecnico' && (
          <div
            id={`panel-${project.id}-tecnico`}
            role="tabpanel"
            aria-labelledby={`tab-${project.id}-tecnico`}
            className="studio-tab-panel studio-tab-panel-spec"
          >
            <div className="studio-spec-meta-grid">
              <div className="studio-spec-cell">
                <span className="studio-spec-label">Categoría</span>
                <span className="studio-spec-value">{project.category}</span>
              </div>
              <div className="studio-spec-cell">
                <span className="studio-spec-label">Estado</span>
                <span className="studio-spec-value">{project.status}</span>
              </div>
              <div className="studio-spec-cell">
                <span className="studio-spec-label">Referencia</span>
                <span className="studio-spec-value">{addressLabel}</span>
              </div>
            </div>

            <div className="studio-spec-highlights">
              <span className="studio-spec-label">Decisiones de implementación</span>
              <ul className="studio-highlights-list">
                {project.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'movil' && (
          <div
            id={`panel-${project.id}-movil`}
            role="tabpanel"
            aria-labelledby={`tab-${project.id}-movil`}
            className="studio-tab-panel studio-tab-panel-mobile"
          >
            <div className="studio-mobile-device-shell">
              <div className="studio-mobile-notch" aria-hidden="true" />
              <div className="studio-mobile-screen">
                <img
                  src={project.image.src}
                  alt={`Vista adaptable de ${project.title}`}
                  width={project.image.width}
                  height={project.image.height}
                  loading="lazy"
                  decoding="async"
                  className="studio-mobile-thumb"
                />
                <div className="studio-mobile-caption">
                  <strong>{project.title}</strong>
                  <span>{project.subtitle}</span>
                  {primaryHref && (
                    <a
                      href={primaryHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="studio-mobile-link"
                    >
                      <span>Abrir enlace</span>
                      <ArrowUpRightIcon size={11} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
