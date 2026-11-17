import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDisplayMode } from '../context/DisplayModeContext';
import {
  techCategories,
  technologiesData,
  type LearningStage,
  type TechItem,
} from '../data/portfolioData';
import {
  LayersIcon,
  TechIcon,
} from '../components/Icons';

type StageFilter = 'Todas' | LearningStage;

interface BurstEffect {
  id: number;
  x: number;
  y: number;
  color: string;
}

interface PileItemState {
  id: string;
  x: number;
  y: number;
  rotate: number;
  seedAngle: number;
}

const STAGE_OPTIONS: StageFilter[] = ['Todas', 'Práctica activa', 'En aprendizaje'];

const TECH_HEAD_WORDS = ['Herramientas', 'reales,', 'aplicadas', 'con'];

const BURST_COLORS = ['#e4e4e7', '#a1a1aa', '#f5f5f5', '#d4d4d8'];

function buildInitialPilePositions(items: TechItem[]): Record<string, PileItemState> {
  const map: Record<string, PileItemState> = {};
  const cols = 3;
  items.forEach((item, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    // Distribución en 3 columnas escalonadas dentro de .studio-sv-pile sin solapamientos
    const staggerX = row % 2 === 1 ? 3 : 0;
    const offsetX = ((idx * 7) % 5) - 2;
    const offsetY = ((idx * 5) % 3) - 1;
    const xPct = 4 + col * 31 + staggerX + offsetX;
    const yPct = 4 + row * 15.5 + offsetY;
    const rotate = ((idx * 7) % 7) - 3;
    map[item.id] = {
      id: item.id,
      x: Math.min(Math.max(xPct, 3), 70),
      y: Math.min(Math.max(yPct, 3), 85),
      rotate,
      seedAngle: rotate,
    };
  });
  return map;
}

export const Technologies: React.FC = () => {
  const { calmMode, liteMode } = useDisplayMode();
  const [stageFilter, setStageFilter] = useState<StageFilter>('Todas');
  const [selectedId, setSelectedId] = useState<string>(technologiesData[0]?.id ?? 'postgresql');
  const [bursts, setBursts] = useState<BurstEffect[]>([]);
  const [pilePositions, setPilePositions] = useState<Record<string, PileItemState>>(() =>
    buildInitialPilePositions(technologiesData)
  );
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const pileRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    id: string;
    startX: number;
    startY: number;
    origXPct: number;
    origYPct: number;
    moved: boolean;
  } | null>(null);

  const stageCounts = useMemo(() => {
    const active = technologiesData.filter((t) => t.stage === 'Práctica activa').length;
    const learning = technologiesData.filter((t) => t.stage === 'En aprendizaje').length;
    return {
      Todas: technologiesData.length,
      'Práctica activa': active,
      'En aprendizaje': learning,
    };
  }, []);

  const filteredTechnologies = useMemo(() => {
    if (stageFilter === 'Todas') return technologiesData;
    return technologiesData.filter((tech) => tech.stage === stageFilter);
  }, [stageFilter]);

  const activeTech: TechItem | undefined = useMemo(() => {
    return (
      filteredTechnologies.find((t) => t.id === selectedId) ??
      filteredTechnologies[0] ??
      technologiesData[0]
    );
  }, [filteredTechnologies, selectedId]);

  const activeCategoryMeta = useMemo(() => {
    if (!activeTech) return undefined;
    return techCategories.find((cat) => cat.id === activeTech.category);
  }, [activeTech]);

  const groupedCategories = useMemo(() => {
    return techCategories
      .map((category) => ({
        ...category,
        items: filteredTechnologies.filter((tech) => tech.category === category.id),
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredTechnologies]);

  const spawnBurst = useCallback(
    (clientX?: number, clientY?: number) => {
      if (calmMode || liteMode) return;
      const arena = pileRef.current;
      if (!arena) return;
      const rect = arena.getBoundingClientRect();
      const x = clientX !== undefined ? clientX - rect.left : rect.width * 0.5;
      const y = clientY !== undefined ? clientY - rect.top : rect.height * 0.5;
      const burstId = Date.now() + Math.random();
      const color = BURST_COLORS[Math.floor(Math.random() * BURST_COLORS.length)];
      setBursts((prev) => [...prev.slice(-4), { id: burstId, x, y, color }]);
      window.setTimeout(() => {
        setBursts((prev) => prev.filter((b) => b.id !== burstId));
      }, 480);
    },
    [calmMode, liteMode]
  );

  const handleStageChange = (stage: StageFilter) => {
    setStageFilter(stage);
    const nextList =
      stage === 'Todas'
        ? technologiesData
        : technologiesData.filter((tech) => tech.stage === stage);
    if (nextList.length > 0 && !nextList.some((item) => item.id === selectedId)) {
      setSelectedId(nextList[0].id);
    }
    setPilePositions(buildInitialPilePositions(nextList));
  };

  // Arrastre táctil y mouse en la arena interactiva .studio-sv-pile
  const handlePiecePointerDown = (
    event: React.PointerEvent<HTMLButtonElement>,
    techId: string
  ) => {
    if (calmMode) {
      setSelectedId(techId);
      return;
    }
    const pos = pilePositions[techId];
    if (!pos) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStateRef.current = {
      id: techId,
      startX: event.clientX,
      startY: event.clientY,
      origXPct: pos.x,
      origYPct: pos.y,
      moved: false,
    };
    setDraggingId(techId);
  };

  const handlePiecePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = dragStateRef.current;
    const arena = pileRef.current;
    if (!drag || !arena) return;

    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      drag.moved = true;
    }
    if (!drag.moved) return;

    const rect = arena.getBoundingClientRect();
    const dxPct = (dx / Math.max(rect.width, 1)) * 100;
    const dyPct = (dy / Math.max(rect.height, 1)) * 100;

    setPilePositions((prev) => {
      const current = prev[drag.id];
      if (!current) return prev;
      return {
        ...prev,
        [drag.id]: {
          ...current,
          x: Math.min(Math.max(drag.origXPct + dxPct, 2), 80),
          y: Math.min(Math.max(drag.origYPct + dyPct, 4), 84),
          rotate: current.seedAngle * 0.4,
        },
      };
    });
  };

  const handlePiecePointerUp = (
    event: React.PointerEvent<HTMLButtonElement>,
    techId: string
  ) => {
    const drag = dragStateRef.current;
    dragStateRef.current = null;
    setDraggingId(null);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setSelectedId(techId);
    if (!drag?.moved) {
      spawnBurst(event.clientX, event.clientY);
    }
  };

  // Micro-repulsión / respuesta sutil de flotación cuando el usuario no arrastra
  useEffect(() => {
    setPilePositions(buildInitialPilePositions(filteredTechnologies));
  }, [filteredTechnologies]);

  return (
    <section
      id="tecnologias"
      className="studio-section studio-sv studio-tech-section"
      aria-labelledby="tech-heading"
    >
      <div className="studio-container">
        <header className="studio-section-header studio-sv-head">
          <div className="studio-section-kicker-wrap">
            <span className="studio-kicker-label">Tecnologías · Stack Verificado</span>
          </div>

          <div className="studio-tech-title-row">
            <div>
              <h2 id="tech-heading" className="studio-sv-title">
                {TECH_HEAD_WORDS.map((word, idx) => (
                  <span
                    key={`${word}-${idx}`}
                    className="studio-sv-word"
                    style={{ '--w': idx } as React.CSSProperties}
                  >
                    <span>{word} </span>
                  </span>
                ))}
                <span className="studio-sv-word" style={{ '--w': 4 } as React.CSSProperties}>
                  <span className="studio-sv-wow">criterio práctico.</span>
                </span>
              </h2>
              <p className="studio-sv-lede">
                Cada tecnología listada corresponde exclusivamente a implementaciones reales de mi
                formación y proyectos activos. Arrastra o pulsa sobre cada ficha para inspeccionar su
                contexto.
              </p>
            </div>

            <div className="studio-filter-group" role="group" aria-label="Filtrar por etapa">
              {STAGE_OPTIONS.map((stage) => {
                const isSelected = stageFilter === stage;
                const count = stageCounts[stage];
                return (
                  <button
                    key={stage}
                    type="button"
                    className={`studio-filter-btn ${isSelected ? 'is-active' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => handleStageChange(stage)}
                  >
                    <span>{stage}</span>
                    <span className="studio-filter-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Arena interactiva (.sv-pile) + Inspector Cromado Lateral */}
        <div className="studio-tech-interactive-band">
          <div
            ref={pileRef}
            className="studio-sv-pile"
            data-dragging={draggingId ? 'true' : undefined}
            data-cursor-label={!calmMode ? 'Arrastrar / Pulsa' : undefined}
            aria-label="Arena interactiva de tecnologías reales"
          >
            <div className="studio-pile-grid-lines" aria-hidden="true" />
            <span className="studio-pile-hint">
              Mesa de trabajo · Arrastra o selecciona cualquier tecnología
            </span>

            <div className="studio-pile-items">
              {filteredTechnologies.map((tech, idx) => {
                const pos = pilePositions[tech.id] ?? { x: 10, y: 12, rotate: 0 };
                const isSelected = activeTech?.id === tech.id;
                const isLearning = tech.stage === 'En aprendizaje';
                return (
                  <button
                    key={tech.id}
                    type="button"
                    className={`studio-sv-piece ${isSelected ? 'is-selected' : ''} ${
                      isLearning ? 'is-learning' : ''
                    }`}
                    style={
                      {
                        '--px': `${pos.x}%`,
                        '--py': `${pos.y}%`,
                        '--prot': `${pos.rotate}deg`,
                        '--pidx': idx,
                      } as React.CSSProperties
                    }
                    aria-pressed={isSelected}
                    onPointerDown={(e) => handlePiecePointerDown(e, tech.id)}
                    onPointerMove={handlePiecePointerMove}
                    onPointerUp={(e) => handlePiecePointerUp(e, tech.id)}
                    onClick={() => {
                      if (draggingId) return;
                      setSelectedId(tech.id);
                    }}
                  >
                    <TechIcon iconKey={tech.iconKey} size={15} />
                    <span>{tech.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Destellos radiales (.sv-burst) */}
            {bursts.map((burst) => (
              <div
                key={burst.id}
                className="studio-sv-burst"
                style={
                  {
                    left: `${burst.x}px`,
                    top: `${burst.y}px`,
                    '--c': burst.color,
                  } as React.CSSProperties
                }
                aria-hidden="true"
              >
                {Array.from({ length: 8 }).map((_, rayIdx) => (
                  <i
                    key={rayIdx}
                    style={{ '--a': `${rayIdx * 45}deg` } as React.CSSProperties}
                  >
                    <b />
                  </i>
                ))}
              </div>
            ))}
          </div>

          <aside className="studio-tech-inspector" aria-live="polite">
            {activeTech && (
              <div className="studio-inspector-card">
                <div className="studio-inspector-chrome-bar">
                  <span className="studio-inspector-badge">
                    <LayersIcon size={13} />
                    <span>{activeCategoryMeta?.title ?? activeTech.category}</span>
                  </span>
                  <span
                    className={`studio-stage-pill ${
                      activeTech.stage === 'En aprendizaje' ? 'is-learning' : 'is-active'
                    }`}
                  >
                    {activeTech.stage}
                  </span>
                </div>

                <div className="studio-inspector-hero">
                  <div>
                    <h3 className="studio-inspector-title">{activeTech.name}</h3>
                    <p className="studio-inspector-subtitle">
                      {activeCategoryMeta?.description ?? ''}
                    </p>
                  </div>
                </div>

                <div className="studio-inspector-context">
                  <span className="studio-inspector-label">Aplicación concreta</span>
                  <p className="studio-inspector-text">{activeTech.context}</p>
                </div>

                <div className="studio-inspector-footer">
                  <span className="studio-inspector-footnote">
                    Total verificado: {technologiesData.length} tecnologías en {techCategories.length}{' '}
                    categorías reales
                  </span>
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* Matriz editorial de 5 capas técnicas */}
        <div className="studio-sv-cols">
          {groupedCategories.map((category, catIdx) => {
            return (
              <article
                key={category.id}
                className="studio-sv-col"
                style={{ '--i': catIdx } as React.CSSProperties}
              >
                <h3 className="studio-sv-name">{category.title}</h3>
                <p className="studio-sv-line">{category.description}</p>
                <ul className="studio-sv-list">
                  {category.items.map((tech, itemIdx) => {
                    const isSelected = activeTech?.id === tech.id;
                    return (
                      <li
                        key={tech.id}
                        style={{ '--j': itemIdx } as React.CSSProperties}
                      >
                        <button
                          type="button"
                          className={`studio-tech-list-btn ${isSelected ? 'is-selected' : ''}`}
                          aria-pressed={isSelected}
                          onClick={(e) => {
                            setSelectedId(tech.id);
                            spawnBurst(e.clientX, e.clientY);
                          }}
                        >
                          <TechIcon iconKey={tech.iconKey} size={14} />
                          <span>{tech.name}</span>
                          {tech.stage === 'En aprendizaje' && (
                            <span className="studio-tech-mini-tag">Aprendiendo</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
