"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { missions, planets } from "../data";
import type { GameProfile, PlanetRecord, ViewId } from "../types";
import { ActivityGuide } from "./ActivityGuide";

const SpaceFlightExperience = dynamic(() => import("./SpaceFlightExperience").then((module) => module.SpaceFlightExperience), { ssr: false, loading: () => <div className="simulation-loading" role="status">Preparando cabine 3D…</div> });

interface WorldViewProps {
  profile: GameProfile;
  onNavigate: (view: ViewId) => void;
  onPlanet: (planet: PlanetRecord) => void;
}

const regions = [
  { id: "chem", name: "Vale Elemental", subtitle: "Química da matéria", icon: "⚗", className: "region-chem", view: "matter" as ViewId },
  { id: "force", name: "Campo de Forças", subtitle: "Física & órbitas", icon: "◎", className: "region-force", view: "cosmic" as ViewId },
  { id: "bio", name: "Biosfera Viva", subtitle: "Biologia em ação", icon: "⌁", className: "region-bio", view: "missions" as ViewId },
  { id: "tech", name: "Oficina do Futuro", subtitle: "Tecnologia & energia", icon: "⌘", className: "region-tech", view: "missions" as ViewId },
];

export function WorldView({ profile, onNavigate, onPlanet }: WorldViewProps) {
  const [flightDestination, setFlightDestination] = useState<PlanetRecord | undefined>();
  const [showFlight, setShowFlight] = useState(false);
  const dailyIndex = [...(profile.lastActiveDate || "cosmolab")].reduce((total, character) => total + character.charCodeAt(0), 0) % missions.length;
  const dailyMission = missions[dailyIndex];
  const dailyCompleted = profile.completed.includes(dailyMission.id);
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
      <ActivityGuide title="Mapa de exploração" goal="Escolher seu próximo destino científico." steps={["Veja as quatro regiões", "Escolha um laboratório", "Pouse em um planeta", "Volte ao mapa quando quiser"]} reward="Não existe ordem obrigatória: sua curiosidade cria a rota." />

      <section className="daily-dashboard" aria-label="Progresso diário"><div className="daily-mission"><div><p className="eyebrow">Expedição do dia</p><h2>{dailyMission.title}</h2><p>{dailyMission.description}</p></div><span><small>RECOMPENSA</small><strong>+{dailyMission.xp} XP</strong></span><button className={dailyCompleted ? "secondary-button" : "primary-button"} onClick={() => onNavigate("missions")}>{dailyCompleted ? "Revisitar missão" : "Abrir no painel"}</button></div><div className="streak-card"><small>Sequência científica</small><strong>{profile.streak || 1} dias</strong><p>Volte, experimente e registre ao menos uma observação por dia.</p><div className="streak-week">{Array.from({ length: 7 }, (_, index) => <i className={index < Math.min(7, profile.streak || 1) ? "active" : ""} key={index}><span>{index + 1}</span></i>)}</div></div></section>

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
          <button className={`landing-node landing-${index + 1}`} key={planet.id} onClick={() => { setFlightDestination(planet); setShowFlight(true); }} aria-label={`Viajar para ${planet.name}`}>
            <span className={`planet-dot-${planet.id}`} aria-hidden="true" />
            <small>{planet.name}</small>
          </button>
        ))}

        <button className="uap-signal" onClick={() => onNavigate("uap")} aria-label="Investigar sinal não identificado">
          <span>?</span><small>SINAL NÃO IDENTIFICADO</small>
        </button>
      </div>

      <div className="world-actions">
        <button className="action-tile flight-action" onClick={() => { setFlightDestination(undefined); setShowFlight(true); }}>
          <span className="action-icon">▲</span>
          <span><strong>Pilotar nave</strong><small>Assuma os controles, escolha um planeta e viaje em 3D.</small></span>
          <b aria-hidden="true">→</b>
        </button>
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
      {showFlight && <SpaceFlightExperience profile={profile} initialDestination={flightDestination} onClose={() => setShowFlight(false)} onArrive={(planet) => { setShowFlight(false); onPlanet(planet); }} />}
    </section>
  );
}
