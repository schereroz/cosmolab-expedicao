"use client";

import { useMemo, useState } from "react";
import { celestialBodies } from "../data";
import { formatScientific, simulateCollision } from "../lib/science";
import type { CollisionResult } from "../types";
import { SciencePassport } from "./SciencePassport";

const guidedScenarios = [
  { name: "Formação da Lua", projectile: "theia", target: "earth", speed: 10, angle: 45 },
  { name: "Asteroide e Marte", projectile: "ceres", target: "mars", speed: 18, angle: 32 },
  { name: "Cometa rasante", projectile: "halley", target: "earth", speed: 52, angle: 78 },
];

export function CosmicLab() {
  const [projectileId, setProjectileId] = useState("theia");
  const [targetId, setTargetId] = useState("earth");
  const [speed, setSpeed] = useState(10);
  const [angle, setAngle] = useState(45);
  const [result, setResult] = useState<CollisionResult | null>(null);
  const [runId, setRunId] = useState(0);

  const projectile = useMemo(() => celestialBodies.find((body) => body.id === projectileId)!, [projectileId]);
  const target = useMemo(() => celestialBodies.find((body) => body.id === targetId)!, [targetId]);

  function runSimulation() {
    setResult(simulateCollision(projectile, target, speed, angle));
    setRunId((value) => value + 1);
  }

  function loadScenario(index: number) {
    const scenario = guidedScenarios[index];
    setProjectileId(scenario.projectile);
    setTargetId(scenario.target);
    setSpeed(scenario.speed);
    setAngle(scenario.angle);
    setResult(null);
  }

  return (
    <section className="module-view cosmic-lab" aria-labelledby="cosmic-title">
      <div className="module-header">
        <div>
          <p className="eyebrow">Ambiente livre · mecânica orbital</p>
          <h1 id="cosmic-title">Sandbox Cósmico</h1>
          <p>Você escolhe os astros. O modelo calcula energia, momento e um resultado aproximado.</p>
        </div>
        <span className="evidence-chip calculated"><b>∑</b> Modelo calculado</span>
      </div>

      <div className="cosmic-layout">
        <aside className="control-panel">
          <h2>Preparar encontro</h2>
          <label>Astro lançado
            <select value={projectileId} onChange={(event) => setProjectileId(event.target.value)}>
              {celestialBodies.filter((body) => body.id !== targetId).map((body) => <option value={body.id} key={body.id}>{body.name}</option>)}
            </select>
          </label>
          <div className="versus-mark" aria-hidden="true">×</div>
          <label>Astro-alvo
            <select value={targetId} onChange={(event) => setTargetId(event.target.value)}>
              {celestialBodies.filter((body) => body.id !== projectileId).map((body) => <option value={body.id} key={body.id}>{body.name}</option>)}
            </select>
          </label>
          <label className="range-label">
            <span>Velocidade relativa <output>{speed} km/s</output></span>
            <input type="range" min="1" max="80" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} />
          </label>
          <label className="range-label">
            <span>Ângulo de encontro <output>{angle}°</output></span>
            <input type="range" min="5" max="85" value={angle} onChange={(event) => setAngle(Number(event.target.value))} />
          </label>
          <div className="body-readout">
            <span><small>Massa lançada</small><strong>{formatScientific(projectile.massKg)} kg</strong></span>
            <span><small>Atmosfera-alvo</small><strong>{target.atmosphere ? "Presente" : "Ausente"}</strong></span>
          </div>
          <button className="primary-button simulate-button" onClick={runSimulation}>▶ Simular colisão</button>

          <div className="guided-scenarios">
            <h3>Cenários guiados</h3>
            {guidedScenarios.map((scenario, index) => (
              <button key={scenario.name} onClick={() => loadScenario(index)}><span>{index + 1}</span>{scenario.name}</button>
            ))}
          </div>
        </aside>

        <div className="simulation-column">
          <div className={`collision-stage ${result ? "has-result" : ""}`} key={runId}>
            <div className="stage-grid" aria-hidden="true" />
            <div className="trajectory-line" aria-hidden="true" />
            <div className="projectile-body body-theia"><span>{projectile.name}</span></div>
            <div className="target-body body-earth"><span>{target.name}</span></div>
            {result && <div className="impact-flash" aria-hidden="true" />}
            <div className="stage-hud top-left">SIMULAÇÃO EDUCATIVA<br /><b>Escala visual adaptada</b></div>
            <div className="stage-hud bottom-right">v = {speed} km/s<br />θ = {angle}°</div>
          </div>

          {result ? (
            <div className="result-panel" role="status" aria-live="polite">
              <div className="result-title">
                <span className="result-symbol">◎</span>
                <div><small>RESULTADO PROVÁVEL</small><h2>{result.outcome}</h2></div>
                <span className="uncertainty">±{result.uncertainty}% incerteza</span>
              </div>
              <p>{result.summary}</p>
              <div className="metric-grid">
                <span><small>Energia cinética</small><strong>{formatScientific(result.energyJoules)} J</strong></span>
                <span><small>Momento linear</small><strong>{formatScientific(result.momentum)} kg·m/s</strong></span>
                <span><small>Velocidade</small><strong>{result.velocityMs.toLocaleString("pt-BR")} m/s</strong></span>
              </div>
              <SciencePassport
                evidence="calculated_model"
                source="Gravitação newtoniana e limites didáticos de energia específica"
                uncertainty={result.uncertainty}
                assumptions={["Corpos aproximadamente esféricos", "Sem relatividade", "Fragmentação e atmosfera simplificadas"]}
              />
            </div>
          ) : (
            <div className="empty-result"><span>↗</span><div><strong>Pronto para calcular</strong><p>Ajuste os parâmetros e inicie a simulação. Os astros originais nunca são alterados.</p></div></div>
          )}
        </div>
      </div>
    </section>
  );
}
