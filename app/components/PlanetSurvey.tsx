"use client";

import { useState } from "react";
import { evidenceLabels, planets } from "../data";
import type { PlanetRecord } from "../types";
import { ActivityGuide } from "./ActivityGuide";
import { SciencePassport } from "./SciencePassport";

const tools = [
  { id: "spectrometer", icon: "⌁", label: "Espectrômetro" },
  { id: "microscope", icon: "⊕", label: "Microscópio" },
  { id: "seismic", icon: "≋", label: "Sismógrafo" },
  { id: "magnetic", icon: "∩", label: "Magnetômetro" },
];

export function PlanetSurvey({ initialPlanet, onClose }: { initialPlanet: PlanetRecord; onClose: () => void }) {
  const [planet, setPlanet] = useState(initialPlanet);
  const [activeTool, setActiveTool] = useState("spectrometer");
  const evidence = evidenceLabels[planet.evidence];

  return (
    <section className="planet-survey" aria-labelledby="planet-title">
      <div className="planet-hero">
        <div className="planet-stars" aria-hidden="true" />
        <button className="close-button" onClick={onClose} aria-label="Fechar análise planetária">×</button>
        <div className={`planet-sphere planet-${planet.id}`} aria-hidden="true"><span /></div>
        <div className="planet-identity">
          <p className="eyebrow">Expedição planetária · {planet.landingMode === "pouso" ? "pouso autorizado" : "descida de sonda"}</p>
          <h1 id="planet-title">{planet.name}</h1>
          <p>{planet.subtitle}</p>
          <span className={`evidence-chip evidence-${planet.evidence}`}><b>{evidence.icon}</b>{evidence.label}</span>
        </div>
        <div className="planet-switcher">
          {planets.map((item) => <button key={item.id} className={item.id === planet.id ? "active" : ""} onClick={() => setPlanet(item)}>{item.name}</button>)}
        </div>
      </div>

      <div className="planet-guide"><ActivityGuide title="Análise planetária" goal="Usar instrumentos para separar o que foi medido, inferido ou ainda é desconhecido." steps={["Escolha um mundo", "Ative um instrumento", "Compare ambiente e materiais", "Confira as fontes"]} reward="Explique se o ambiente poderia sustentar vida conhecida sem afirmar além dos dados." /></div>

      <div className="survey-body">
        <aside className="instrument-panel">
          <h2>Instrumentos</h2>
          <p>Selecione uma ferramenta para examinar este mundo.</p>
          {tools.map((tool) => (
            <button key={tool.id} className={activeTool === tool.id ? "active" : ""} onClick={() => setActiveTool(tool.id)}>
              <span aria-hidden="true">{tool.icon}</span>{tool.label}<b aria-hidden="true">→</b>
            </button>
          ))}
          <div className="avatar-on-planet"><span aria-hidden="true">🐼</span><div><small>Explorador em campo</small><strong>Traje pressurizado</strong></div></div>
        </aside>

        <div className="survey-content">
          <div className="survey-heading"><div><p className="eyebrow">Leitura do {tools.find((tool) => tool.id === activeTool)?.label}</p><h2>Composição e ambiente</h2></div><span className="live-reading"><i /> leitura concluída</span></div>
          <div className="environment-grid">
            <article><span>g</span><small>Gravidade</small><strong>{planet.gravity}</strong></article>
            <article><span>°</span><small>Temperatura</small><strong>{planet.temperature}</strong></article>
            <article><span>P</span><small>Pressão</small><strong>{planet.pressure}</strong></article>
            <article><span>☢</span><small>Radiação</small><strong>{planet.radiation}</strong></article>
          </div>

          <div className="analysis-grid">
            <article className="atmosphere-card">
              <h3>Atmosfera</h3>
              {planet.atmosphere.map((item) => (
                <div className="composition-row" key={item.label}>
                  <span><b>{item.label}</b><small>{item.value}%</small></span>
                  <div><i className={`composition-fill composition-${item.label.toLowerCase().replace("₂", "2")}`} /></div>
                </div>
              ))}
              {planet.type === "exoplaneta" && <p className="unknown-note">A barra indica “informação ainda desconhecida”, não uma composição de 100%.</p>}
            </article>
            <article className="materials-card">
              <h3>Materiais detectados ou inferidos</h3>
              <div className="material-list">
                {planet.materials.map((material, index) => <span key={material}><i>{index + 1}</i>{material}</span>)}
              </div>
            </article>
          </div>

          <div className="habitability-card">
            <div className="habitability-icon">⌂</div>
            <div><small>CONDIÇÕES PARA VIDA CONHECIDA</small><h3>{planet.id === "europa" ? "Interessante, mas não confirmada" : planet.id === "kepler" ? "Dados insuficientes" : "Ambiente muito hostil"}</h3><p>Habitabilidade não significa que exista vida. Água, energia e química adequada são apenas parte da investigação.</p></div>
          </div>
          <SciencePassport evidence={planet.evidence} source={planet.source} assumptions={["Valores médios e arredondados", "Condições locais podem variar", "Ilustração fora de escala"]} />
        </div>
      </div>
    </section>
  );
}
