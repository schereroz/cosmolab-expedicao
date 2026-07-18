"use client";

import { useMemo, useState } from "react";
import { evidenceLabels, missionChallenges } from "../data";
import type { GameProfile, Mission } from "../types";
import { SciencePassport } from "./SciencePassport";

export function MissionRunner({ mission, mode, onComplete, onClose }: { mission: Mission; mode: GameProfile["ageBand"]; onComplete: () => void; onClose: () => void }) {
  const challenge = missionChallenges[mission.id];
  const [phase, setPhase] = useState<"briefing" | "experiment" | "debrief">("briefing");
  const [hypothesis, setHypothesis] = useState<number | null>(null);
  const [value, setValue] = useState(challenge.variable.start);
  const [tested, setTested] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const inIdealRange = value >= challenge.variable.idealMin && value <= challenge.variable.idealMax;
  const hypothesisCorrect = hypothesis === challenge.correctChoice;
  const resultText = value < challenge.variable.idealMin ? challenge.lowResult : value > challenge.variable.idealMax ? challenge.highResult : challenge.idealResult;
  const buckets = useMemo(() => Array.from({ length: 16 }, (_, index) => challenge.variable.min + (index / 15) * (challenge.variable.max - challenge.variable.min)), [challenge]);

  function testHypothesis() {
    setTested(true);
    setAttempts((count) => count + 1);
    if (hypothesisCorrect && inIdealRange) setPhase("debrief");
  }

  return (
    <div className="mission-overlay" role="dialog" aria-modal="true" aria-labelledby="runner-title">
      <section className="mission-runner">
        <header className="runner-header">
          <div className="runner-mission-icon">{mission.icon}</div>
          <div><p className="eyebrow">{mission.region} · {mission.domain}</p><h1 id="runner-title">{mission.title}</h1><span className={`evidence-chip evidence-${mission.evidence}`}><b>{evidenceLabels[mission.evidence].icon}</b>{evidenceLabels[mission.evidence].label}</span></div>
          <button className="runner-close" onClick={onClose} aria-label="Fechar missão">×</button>
        </header>
        <div className="runner-progress" aria-label="Progresso da missão"><span className="active"><i>1</i>Hipótese</span><em /><span className={phase !== "briefing" ? "active" : ""}><i>2</i>Experimento</span><em /><span className={phase === "debrief" ? "active" : ""}><i>3</i>Descoberta</span></div>

        {phase === "briefing" && <div className="runner-body briefing-body">
          <div className="mission-brief-visual"><span>{mission.icon}</span><small>SIMULAÇÃO DE BANCADA</small></div>
          <div><p className="eyebrow">Briefing da missão</p><h2>Faça sua hipótese</h2><p>{challenge.question}</p><div className="hypothesis-options">{challenge.choices.map((choice, index) => <button key={choice} className={hypothesis === index ? "selected" : ""} onClick={() => setHypothesis(index)}><span>{String.fromCharCode(65 + index)}</span>{choice}</button>)}</div><button className="primary-button runner-next" disabled={hypothesis === null} onClick={() => setPhase("experiment")}>Ir para o experimento →</button></div>
        </div>}

        {phase === "experiment" && <div className="runner-body experiment-body">
          <div className="experiment-console">
            <div className="console-top"><div><p className="eyebrow">Variável controlada</p><h2>{challenge.variable.label}</h2></div><output>{value.toLocaleString("pt-BR")}{challenge.variable.unit}</output></div>
            <input aria-label={challenge.variable.label} type="range" min={challenge.variable.min} max={challenge.variable.max} step={challenge.variable.step} value={value} onChange={(event) => { setValue(Number(event.target.value)); setTested(false); }} />
            <div className="data-strip" aria-label="Escala do experimento">{buckets.map((bucket, index) => <i key={index} className={`${bucket >= challenge.variable.idealMin && bucket <= challenge.variable.idealMax ? "ideal" : ""} ${Math.abs(bucket - value) <= (challenge.variable.max - challenge.variable.min) / 30 ? "current" : ""}`} />)}</div>
            <div className="scale-labels"><span>{challenge.variable.min}{challenge.variable.unit}</span><small>faixa científica do desafio</small><span>{challenge.variable.max}{challenge.variable.unit}</span></div>
            <button className="primary-button test-hypothesis" onClick={testHypothesis}>▶ Testar hipótese</button>
          </div>
          <aside className="live-notebook">
            <p className="eyebrow">Caderno de campo</p><h2>Leitura do teste</h2>
            {!tested ? <div className="waiting-reading"><span>⌁</span><p>Ajuste uma variável e execute o teste. O modelo usa o mesmo estado enquanto você não mudar o controle.</p></div> : <>
              <div className={`reading-result ${inIdealRange ? "in-range" : "out-range"}`}><span>{inIdealRange ? "✓" : "↻"}</span><p>{resultText}</p></div>
              <div className={`hypothesis-check ${hypothesisCorrect ? "correct" : "incorrect"}`}><small>SUA HIPÓTESE</small><strong>{challenge.choices[hypothesis ?? 0]}</strong><p>{hypothesisCorrect ? "Compatível com o conhecimento científico usado no desafio." : "Ainda não é compatível. Volte às opções e procure a explicação que conserva os dados."}</p></div>
              {(!inIdealRange || !hypothesisCorrect) && <button className="secondary-button retry-hypothesis" onClick={() => { if (!hypothesisCorrect) setPhase("briefing"); setTested(false); }}>{hypothesisCorrect ? "Ajustar variável" : "Revisar hipótese"}</button>}
            </>}
            <div className="attempt-counter"><span>Tentativas</span><strong>{attempts}</strong><small>Errar faz parte do experimento.</small></div>
          </aside>
        </div>}

        {phase === "debrief" && <div className="runner-body debrief-body">
          <div className="discovery-burst"><span>✦</span><small>DESCOBERTA VALIDADA</small></div>
          <div><p className="eyebrow">Hipótese confirmada pelo modelo</p><h2>O que os dados mostram</h2><p className="debrief-lead">{challenge.explanation}</p><div className="finding-card"><small>RESULTADO DO SEU TESTE</small><strong>{value.toLocaleString("pt-BR")}{challenge.variable.unit}</strong><p>{challenge.idealResult}</p></div>{mode === "researcher" ? <div className="researcher-debrief"><span>Σ</span><div><small>MODO PESQUISADOR</small><p>{challenge.researcherNote}</p></div></div> : <div className="explorer-debrief"><span>🧭</span><div><small>MODO EXPLORADOR</small><p>Explique com suas palavras: o que mudou quando você ajustou a variável?</p></div></div>}<SciencePassport evidence={mission.evidence} source={challenge.source} assumptions={["Modelo educativo com uma variável principal", "Resultados reais podem depender de outras condições", "A faixa ideal serve ao desafio e não é uma regra universal"]} /><button className="primary-button register-discovery" onClick={onComplete}>Registrar descoberta · +{mission.xp} XP</button></div>
        </div>}
      </section>
    </div>
  );
}
