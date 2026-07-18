"use client";

import { useMemo, useState } from "react";
import { celestialBodies, evidenceLabels } from "../data";
import { formatScientific, simulateCollision } from "../lib/science";
import type { CollisionResult, GameProfile } from "../types";
import { ActivityGuide } from "./ActivityGuide";
import { SciencePassport } from "./SciencePassport";

const guidedScenarios = [
  { name: "Formação da Lua", projectile: "theia", target: "earth", speed: 10, angle: 45 },
  { name: "Asteroide e Marte", projectile: "ceres", target: "mars", speed: 18, angle: 32 },
  { name: "Cometa rasante", projectile: "halley", target: "earth", speed: 52, angle: 78 },
  { name: "Sonda e buraco negro", projectile: "ufo", target: "black-hole", speed: 70, angle: 74 },
  { name: "Pulso em gravastar", projectile: "laser", target: "gravastar", speed: 80, angle: 40 },
];

const frontierKinds = new Set(["buraco-negro", "buraco-branco", "minhoca", "gravastar", "fuzzball"]);

export function CosmicLab({ mode }: { mode: GameProfile["ageBand"] }) {
  const [projectileId, setProjectileId] = useState("theia");
  const [targetId, setTargetId] = useState("earth");
  const [speed, setSpeed] = useState(10);
  const [angle, setAngle] = useState(45);
  const [result, setResult] = useState<CollisionResult | null>(null);
  const [runId, setRunId] = useState(0);
  const [prediction, setPrediction] = useState("");

  const projectile = useMemo(() => celestialBodies.find((body) => body.id === projectileId)!, [projectileId]);
  const target = useMemo(() => celestialBodies.find((body) => body.id === targetId)!, [targetId]);
  const scenarioEvidence = projectile.evidence === "fiction" || target.evidence === "fiction"
    ? "fiction"
    : projectile.evidence === "hypothesis" || target.evidence === "hypothesis"
      ? "hypothesis"
      : "calculated_model";

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
    setPrediction("");
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
      <ActivityGuide title="Colisões" goal="Prever o encontro, testar parâmetros e explicar o resultado usando energia, massa e trajetória." steps={["Escolha os objetos", "Faça uma previsão", "Ajuste velocidade e ângulo", "Simule e compare"]} reward="Descubra quando um corpo desvia, se fragmenta, se funde ou é capturado." />

      <div className="cosmic-layout">
        <aside className="control-panel">
          <h2>Preparar encontro</h2>
          <label>Astro ou artefato lançado
            <select value={projectileId} onChange={(event) => setProjectileId(event.target.value)}>
              {celestialBodies.filter((body) => body.id !== targetId).map((body) => <option value={body.id} key={body.id}>{body.name} · {evidenceLabels[body.evidence].label}</option>)}
            </select>
          </label>
          <div className="versus-mark" aria-hidden="true">×</div>
          <label>Astro ou objeto-alvo
            <select value={targetId} onChange={(event) => setTargetId(event.target.value)}>
              {celestialBodies.filter((body) => body.id !== projectileId && !["laser", "bomba-virtual"].includes(body.kind)).map((body) => <option value={body.id} key={body.id}>{body.name} · {evidenceLabels[body.evidence].label}</option>)}
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
            <span><small>Nível de evidência</small><strong>{evidenceLabels[scenarioEvidence].label}</strong></span>
          </div>
          <p className={`object-description evidence-note-${projectile.evidence}`}>{projectile.description}</p>
          <label className="prediction-field">Sua previsão antes do teste
            <select value={prediction} onChange={(event) => setPrediction(event.target.value)}>
              <option value="">O que você acha?</option><option>Desvio</option><option>Captura orbital</option><option>Impacto</option><option>Fusão parcial</option><option>Fragmentação</option><option>Interação hipotética</option>
            </select>
          </label>
          <button className="primary-button simulate-button" onClick={runSimulation}>▶ Simular colisão</button>

          <div className="guided-scenarios">
            <h3>Cenários guiados</h3>
            {guidedScenarios.map((scenario, index) => (
              <button key={scenario.name} onClick={() => loadScenario(index)}><span>{index + 1}</span>{scenario.name}</button>
            ))}
          </div>
        </aside>

        <div className="simulation-column">
          <div className={`collision-stage ${result ? `has-result effect-${result.visualEffect} affect-${result.affectedBody}` : ""}`} key={runId}>
            <div className="stage-grid" aria-hidden="true" />
            <div className="trajectory-line" aria-hidden="true" />
            <div className={`projectile-body body-${projectile.kind}`}><span>{projectile.name}</span></div>
            <div className={`target-body body-${target.kind}`}><span>{target.name}</span></div>
            {result && <div className="impact-flash" aria-hidden="true" />}
            {result && <div className="collision-particles" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>}
            {result && <div className="accretion-ring" aria-hidden="true" />}
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
              <div className={`prediction-result ${prediction === result.outcome ? "matched" : "learned"}`}><span>{prediction ? prediction === result.outcome ? "✓" : "↻" : "?"}</span><p>{prediction ? prediction === result.outcome ? `Sua previsão “${prediction}” combinou com o modelo.` : `Você previu “${prediction}”. O modelo indicou “${result.outcome}”. Mude uma variável e teste outra vez.` : "Na próxima rodada, faça uma previsão antes de simular: comparar hipótese e resultado é parte do método científico."}</p></div>
              <div className="metric-grid">
                <span><small>Energia cinética</small><strong>{formatScientific(result.energyJoules)} J</strong></span>
                <span><small>Momento linear</small><strong>{formatScientific(result.momentum)} kg·m/s</strong></span>
                <span><small>Velocidade</small><strong>{result.velocityMs.toLocaleString("pt-BR")} m/s</strong></span>
              </div>
              {mode === "researcher" ? <div className="cosmic-equations"><div><small>ENERGIA CINÉTICA</small><strong>Eₖ = ½mv²</strong><span>{formatScientific(projectile.massKg)} × ({result.velocityMs.toLocaleString("pt-BR")})² ÷ 2</span></div><div><small>MOMENTO LINEAR</small><strong>p = mv</strong><span>Direção também importa: momento é uma grandeza vetorial.</span></div></div> : <div className="explorer-comparison"><span>🧭</span><p><strong>Tradução visual:</strong> mais massa ou mais velocidade significa mais energia para aquecer, deformar e lançar material.</p></div>}
              <SciencePassport
                evidence={scenarioEvidence}
                source={scenarioEvidence === "calculated_model" ? "Gravitação newtoniana e limites didáticos de energia específica" : scenarioEvidence === "hypothesis" ? "Hipóteses teóricas de espaço-tempo e objetos compactos; sem confirmação observacional para este cenário" : "Artefato narrativo virtual do CosmoLab"}
                uncertainty={result.uncertainty}
                assumptions={["Corpos aproximadamente esféricos", "Sem relatividade completa", "Fragmentação e atmosfera simplificadas", "Armas virtuais não representam tecnologia real"]}
              />
            </div>
          ) : (
            <div className="empty-result"><span>↗</span><div><strong>Pronto para calcular</strong><p>Ajuste os parâmetros e inicie a simulação. Os astros originais nunca são alterados.</p></div></div>
          )}

          <section className="frontier-catalog" aria-labelledby="frontier-title">
            <div><p className="eyebrow">Fronteiras da ciência</p><h2 id="frontier-title">Objetos extremos e hipotéticos</h2><p>Compare o que foi observado com ideias que ainda estão sendo investigadas.</p></div>
            <div className="frontier-grid">
              {celestialBodies.filter((body) => frontierKinds.has(body.kind)).map((body) => (
                <button key={body.id} onClick={() => { setTargetId(body.id); if (projectileId === body.id) setProjectileId("earth"); setResult(null); }}>
                  <span className={`frontier-icon frontier-${body.kind}`} aria-hidden="true">{body.kind === "buraco-negro" ? "●" : body.kind === "minhoca" ? "∞" : "◉"}</span>
                  <span><small>{evidenceLabels[body.evidence].label}</small><strong>{body.name}</strong><em>{body.description}</em></span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
