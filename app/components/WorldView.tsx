"use client";

import { planets } from "../data";
import type { PlanetRecord, ViewId } from "../types";

interface WorldViewProps {
  onNavigate: (view: ViewId) => void;
  onPlanet: (planet: PlanetRecord) => void;
}

const regions = [
  { id: "chem", name: "Vale Elemental", subtitle: "Química da matéria", icon: "⚗", className: "region-chem", view: "matter" as ViewId },
  { id: "force", name: "Campo de Forças", subtitle: "Física & órbitas", icon: "◎", className: "region-force", view: "cosmic" as ViewId },
  { id: "bio", name: "Biosfera Viva", subtitle: "Biologia em ação", icon: "⌁", className: "region-bio", view: "missions" as ViewId },
  { id: "tech", name: "Oficina do Futuro", subtitle: "Tecnologia & energia", icon: "⌘", className: "region-tech", view: "missions" as ViewId },
];

export function WorldView({ onNavigate, onPlanet }: WorldViewProps) {
  return (
    <section className="world-view" aria-labelledby="world-title">
      <div className="world-heading">
        <div>
          <p className="eyebrow">Setor Órion · mapa de exploração</p>
          <h1 id="world-title">Para onde vamos hoje?</h1>
        </div>
        <div className="map-legend" aria-label="Legenda do mapa">
          <span><i className="legend-live" /> Missão disponível</span>
          <span><i className="legend-locked" /> Em descoberta</span>
        </div>
      </div>

      <div className="space-map">
        <div className="star-layer" aria-hidden="true" />
        <div className="orbit orbit-one" aria-hidden="true" />
        <div className="orbit orbit-two" aria-hidden="true" />
        <div className="central-star" aria-label="Estrela Cosmo"><span /></div>
        <div className="ship-marker" aria-label="Sua nave está no centro do mapa"><span>▲</span><small>VOCÊ</small></div>

        {regions.map((region) => (
          <button className={`region-node ${region.className}`} key={region.id} onClick={() => onNavigate(region.view)}>
            <span className="region-planet" aria-hidden="true">{region.icon}</span>
            <span className="region-label"><strong>{region.name}</strong><small>{region.subtitle}</small></span>
          </button>
        ))}

        {planets.slice(0, 3).map((planet, index) => (
          <button className={`landing-node landing-${index + 1}`} key={planet.id} onClick={() => onPlanet(planet)} aria-label={`Pousar em ${planet.name}`}>
            <span className={`planet-dot-${planet.id}`} aria-hidden="true" />
            <small>{planet.name}</small>
          </button>
        ))}

        <button className="uap-signal" onClick={() => onNavigate("uap")} aria-label="Investigar sinal não identificado">
          <span>?</span><small>SINAL NÃO IDENTIFICADO</small>
        </button>
      </div>

      <div className="world-actions">
        <button className="action-tile cosmic-action" onClick={() => onNavigate("cosmic")}>
          <span className="action-icon">☄</span>
          <span><strong>Sandbox Cósmico</strong><small>Escolha astros, ajuste a rota e simule uma colisão.</small></span>
          <b aria-hidden="true">→</b>
        </button>
        <button className="action-tile matter-action" onClick={() => onNavigate("matter")}>
          <span className="action-icon">⚛</span>
          <span><strong>Laboratório da Matéria</strong><small>Combine elementos e investigue novas substâncias.</small></span>
          <b aria-hidden="true">→</b>
        </button>
      </div>
    </section>
  );
}
