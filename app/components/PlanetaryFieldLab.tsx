"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { evidenceLabels } from "../data";
import { planetarySubstances, planetaryTargets, simulatePlanetaryInteraction } from "../lib/planetaryLab";
import type { ChangeType, InteractionTimelinePoint, PlanetaryInteractionResult, PlanetaryLabId } from "../lib/planetaryLab";
import type { PlanetRecord } from "../types";
import { SciencePassport } from "./SciencePassport";

const predictions: ChangeType[] = ["Sem mudança visível", "Mudança física", "Reação química", "Resultado desconhecido"];
const fieldChallenges: Record<PlanetaryLabId, string> = {
  mars: "Encontre uma mudança física sem anunciar uma nova substância.",
  europa: "Descubra por que líquido exposto não duraria nesta superfície.",
  jupiter: "Use a sonda para comparar duas camadas de nuvens.",
  kepler: "Monte uma hipótese sem transformar o cenário em fato.",
};

function ReactionChart({ timeline, title }: { timeline: InteractionTimelinePoint[]; title: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || timeline.length === 0) return;
    const draw = () => {
      const width = Math.max(300, canvas.clientWidth);
      const height = Math.max(210, canvas.clientHeight);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      const context = canvas.getContext("2d");
      if (!context) return;
      context.scale(ratio, ratio);
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#071c25";
      context.fillRect(0, 0, width, height);
      const bounds = { left: 45, right: width - 18, top: 24, bottom: height - 34 };
      context.strokeStyle = "rgba(174, 218, 225, .14)";
      context.lineWidth = 1;
      for (let index = 0; index <= 4; index += 1) {
        const y = bounds.top + ((bounds.bottom - bounds.top) * index) / 4;
        context.beginPath(); context.moveTo(bounds.left, y); context.lineTo(bounds.right, y); context.stroke();
      }
      context.fillStyle = "#8eb0b6";
      context.font = "10px ui-monospace, SFMono-Regular, Menlo, monospace";
      context.fillText("100", 15, bounds.top + 4);
      context.fillText("50", 21, (bounds.top + bounds.bottom) / 2 + 4);
      context.fillText("0", 27, bounds.bottom + 4);
      context.fillText("tempo da simulação (s)", bounds.right - 138, height - 10);

      const temperatureValues = timeline.map((point) => point.temperature);
      const minimumTemperature = Math.min(...temperatureValues);
      const maximumTemperature = Math.max(...temperatureValues);
      const temperatureRange = Math.max(1, maximumTemperature - minimumTemperature);
      const drawSeries = (color: string, values: number[], normalize: (value: number) => number) => {
        context.strokeStyle = color;
        context.lineWidth = 2.4;
        context.shadowColor = color;
        context.shadowBlur = 7;
        context.beginPath();
        values.forEach((value, index) => {
          const x = bounds.left + ((bounds.right - bounds.left) * index) / Math.max(1, values.length - 1);
          const y = bounds.bottom - (bounds.bottom - bounds.top) * Math.max(0, Math.min(1, normalize(value)));
          if (index === 0) context.moveTo(x, y); else context.lineTo(x, y);
        });
        context.stroke();
        context.shadowBlur = 0;
      };
      drawSeries("#67d9ca", timeline.map((point) => point.spectralSignal), (value) => value / 100);
      drawSeries("#f3b94f", temperatureValues, (value) => (value - minimumTemperature) / temperatureRange);
      drawSeries("#ef7658", timeline.map((point) => point.progress), (value) => value / 100);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    draw();
    return () => observer.disconnect();
  }, [timeline]);

  return <div className="reaction-chart"><div className="chart-legend"><strong>{title}</strong><span><i className="legend-spectrum" /> sinal espectral</span><span><i className="legend-temperature" /> temperatura relativa</span><span><i className="legend-progress" /> transformação</span></div><canvas ref={canvasRef} aria-label={`Gráfico temporal da experiência: ${title}`} /></div>;
}

export function PlanetaryFieldLab({ planet, companionName }: { planet: PlanetRecord; companionName: string }) {
  const planetId = (["mars", "europa", "jupiter", "kepler"].includes(planet.id) ? planet.id : "mars") as PlanetaryLabId;
  const targets = planetaryTargets[planetId];
  const [targetId, setTargetId] = useState(targets[0].id);
  const [substanceId, setSubstanceId] = useState(planetarySubstances[0].id);
  const [prediction, setPrediction] = useState<ChangeType | "">("");
  const [result, setResult] = useState<PlanetaryInteractionResult | null>(null);
  const [runId, setRunId] = useState(0);
  const [discoveries, setDiscoveries] = useState<string[]>([]);
  const target = useMemo(() => targets.find((item) => item.id === targetId) ?? targets[0], [targetId, targets]);
  const substance = useMemo(() => planetarySubstances.find((item) => item.id === substanceId) ?? planetarySubstances[0], [substanceId]);

  function runExperiment() {
    const nextResult = simulatePlanetaryInteraction({ planetId, targetId, substanceId });
    setResult(nextResult);
    setRunId((value) => value + 1);
    setDiscoveries((items) => items.includes(nextResult.title) ? items : [...items, nextResult.title]);
  }

  const latestPoint = result?.timeline.at(-1);
  const evidence = result ? evidenceLabels[result.evidence] : evidenceLabels[target.evidence];

  return (
    <section className={`planetary-field-lab field-${planetId}`} aria-labelledby="field-lab-title">
      <header className="field-lab-header">
        <div><p className="eyebrow">Experiência imersiva · laboratório seguro</p><h2 id="field-lab-title">{planetId === "jupiter" ? "Laboratório atmosférico da sonda" : "Laboratório de campo planetário"}</h2><p>{planetId === "jupiter" ? "Júpiter não tem superfície sólida: você pilota a sonda entre nuvens, ventos e pressões crescentes." : "Entre no terreno, escolha uma amostra e aplique uma substância virtual para comparar o antes e o depois."}</p></div>
        <div className="field-discovery-counter"><span>{discoveries.length}</span><small>descobertas nesta expedição</small></div>
      </header>

      {planetId === "kepler" && <div className="hypothesis-lock"><b>?</b><div><strong>MODO HIPÓTESE PERMANENTE</strong><p>Nenhuma imagem de superfície ou atmosfera de Kepler-186f foi obtida. O terreno abaixo é uma visualização imaginativa.</p></div></div>}

      <div className={`planetary-viewport effect-${result?.visualEffect ?? "ready"}`} key={`${planetId}-${runId}`}>
        <div className="field-sky"><i className="field-sun" /><i className="field-moon" /></div>
        <div className="field-horizon" />
        <div className="terrain-ridges"><i /><i /><i /></div>
        <div className="field-particles" aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <i key={index} />)}</div>
        <div className="probe-beam" aria-hidden="true" />
        <div className="surface-targets" aria-label="Objetos disponíveis no ambiente">
          {targets.map((item, index) => <button key={item.id} className={`${item.id === targetId ? "active" : ""} target-position-${index + 1}`} onClick={() => { setTargetId(item.id); setResult(null); }} aria-pressed={item.id === targetId}><span>{item.icon}</span><strong>{item.name}</strong><small>{item.evidence === "observed" ? "observado" : item.evidence === "inferred" ? "inferido" : "hipótese"}</small></button>)}
        </div>
        <div className="field-hud field-hud-left"><small>AMBIENTE</small><strong>{planet.name}</strong><span>{planet.temperature}</span><span>{planet.pressure}</span></div>
        <div className="field-hud field-hud-right"><small>AMOSTRA FIXADA</small><strong>{target.name}</strong><span>{evidence.icon} {evidence.label}</span><span>{result ? `±${result.uncertainty}% incerteza` : "aguardando teste"}</span></div>
        {result && <div className="substance-injection" style={{ "--substance-color": substance.color } as CSSProperties}><span>{substance.formula}</span></div>}
        <div className="companion-transmission"><i>◉</i><p><strong>{companionName}:</strong> {result ? result.observation : "Escolha um objeto, formule uma hipótese e prepare a substância virtual."}</p></div>
      </div>

      <div className="field-console">
        <section className="sample-selector" aria-labelledby="sample-title"><div className="console-title"><span>1</span><div><small>OBJETO DO AMBIENTE</small><h3 id="sample-title">Selecionar amostra</h3></div></div><div className="sample-options">{targets.map((item) => <button key={item.id} className={item.id === targetId ? "active" : ""} onClick={() => { setTargetId(item.id); setResult(null); }} aria-pressed={item.id === targetId}><span>{item.icon}</span><div><strong>{item.name}</strong><small>{item.description}</small></div></button>)}</div></section>
        <section className="substance-selector" aria-labelledby="substance-title"><div className="console-title"><span>2</span><div><small>INVENTÁRIO VIRTUAL</small><h3 id="substance-title">Adicionar substância</h3></div></div><div className="substance-options">{planetarySubstances.map((item) => <button key={item.id} className={item.id === substanceId ? "active" : ""} onClick={() => { setSubstanceId(item.id); setResult(null); }} aria-pressed={item.id === substanceId}><i style={{ background: item.color }} /><strong>{item.formula}</strong><small>{item.name}</small></button>)}</div></section>
        <section className="hypothesis-console" aria-labelledby="hypothesis-title"><div className="console-title"><span>3</span><div><small>MÉTODO CIENTÍFICO</small><h3 id="hypothesis-title">Sua hipótese</h3></div></div><label>O que acontecerá?<select value={prediction} onChange={(event) => setPrediction(event.target.value as ChangeType | "")}><option value="">Escolha antes do teste</option>{predictions.map((item) => <option key={item}>{item}</option>)}</select></label><button className="field-run-button" onClick={runExperiment}>Aplicar {substance.formula} virtualmente</button><p>Experiência somente digital. Não reproduza testes com materiais desconhecidos fora de um laboratório supervisionado.</p></section>
      </div>

      <aside className="field-challenge"><span>MISSÃO EXTRA</span><strong>{fieldChallenges[planetId]}</strong><p>Ganhe uma descoberta diferente alterando apenas uma variável por rodada.</p></aside>

      {result && <div className="field-results" role="status" aria-live="polite">
        <section className="field-result-summary"><div className="result-evidence-row"><span className={`evidence-chip evidence-${result.evidence}`}><b>{evidenceLabels[result.evidence].icon}</b>{evidenceLabels[result.evidence].label}</span><span>±{result.uncertainty}% incerteza</span></div><p className="eyebrow">RESULTADO DO MODELO</p><h2>{result.title}</h2><p>{result.explanation}</p><div className="prediction-check"><span>{prediction === result.changeType ? "✓" : "↻"}</span><p>{prediction ? prediction === result.changeType ? `Sua hipótese “${prediction}” combinou com o modelo.` : `Você previu “${prediction}”; o modelo indicou “${result.changeType}”. Troque uma variável e investigue.` : `O modelo classificou como “${result.changeType}”. Na próxima rodada, registre uma hipótese antes do teste.`}</p></div></section>
        <section className="before-after" aria-labelledby="comparison-title"><div className="console-title"><span>↔</span><div><small>COMPARAÇÃO ANTES E DEPOIS</small><h3 id="comparison-title">Comparação antes e depois</h3></div></div><div><article><small>ANTES</small><strong>{target.name}</strong><p>{result.before}</p></article><i>→</i><article className="after"><small>DEPOIS</small><strong>{result.changeType}</strong><p>{result.after}</p></article></div><div className="after-metrics"><span><small>Temperatura final</small><strong>{latestPoint?.temperature.toLocaleString("pt-BR")} °C</strong></span><span><small>Pressão modelada</small><strong>{latestPoint?.pressure.toLocaleString("pt-BR")} kPa</strong></span><span><small>Sinal espectral</small><strong>{latestPoint?.spectralSignal.toLocaleString("pt-BR")}%</strong></span></div></section>
        <ReactionChart timeline={result.timeline} title={`${substance.formula} + ${target.name}`} />
        <SciencePassport evidence={result.evidence} source={result.source} uncertainty={result.uncertainty} assumptions={["Quantidade virtual padronizada", "Mistura homogênea simplificada", "Sem cinética química completa", planetId === "jupiter" ? "Sonda atmosférica, sem pouso" : "Terreno visual fora de escala"]} />
      </div>}
    </section>
  );
}
