"use client";

import { useState } from "react";
import { uapCases } from "../data";
import type { GameProfile } from "../types";
import { ActivityGuide } from "./ActivityGuide";
import { SciencePassport } from "./SciencePassport";

const possibleAnswers = ["Satélites", "Meteoro", "Fenômeno atmosférico", "Artefato do sensor", "Dados insuficientes", "Nave extraterrestre"];

export function UapArchive({ mode }: { mode: GameProfile["ageBand"] }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [answer, setAnswer] = useState<string | null>(null);
  const [inspected, setInspected] = useState<number[]>([]);
  const current = uapCases[caseIndex];
  const correct = answer === current.answer;
  const evidenceReady = inspected.length === current.evidence.length;

  function changeCase(index: number) {
    setCaseIndex(index);
    setAnswer(null);
    setInspected([]);
  }

  return (
    <section className="module-view uap-view" aria-labelledby="uap-title">
      <div className="uap-header">
        <div className="uap-mark">UAP <span>?</span></div>
        <div><p className="eyebrow">Arquivo de fenômenos anômalos</p><h1 id="uap-title">Investigue antes de concluir</h1><p>“Não identificado” significa que faltam dados — não que sabemos que é extraterrestre.</p></div>
        <span className="evidence-chip inferred"><b>◇</b> Investigação aberta</span>
      </div>
      <ActivityGuide title="Investigue antes de concluir" goal="Identificar a explicação mais compatível sem confundir ausência de identificação com origem extraterrestre." steps={["Observe o registro", "Inspecione cada evidência", "Compare hipóteses", "Conclua provisoriamente"]} reward="Uma boa conclusão usa os dados disponíveis e admite quando eles são insuficientes." />

      <div className="investigation-progress" aria-label="Etapas da investigação">
        <span className="done"><i>1</i><b>Observe</b><small>Leia o registro</small></span><em />
        <span className={inspected.length ? "done" : "active"}><i>2</i><b>Investigue</b><small>{inspected.length}/{current.evidence.length} evidências</small></span><em />
        <span className={evidenceReady ? "done" : ""}><i>3</i><b>Compare</b><small>Teste hipóteses</small></span><em />
        <span className={answer ? "done" : evidenceReady ? "active" : ""}><i>4</i><b>Conclua</b><small>Sempre provisoriamente</small></span>
      </div>

      <div className="case-tabs" role="tablist" aria-label="Casos UAP">
        {uapCases.map((item, index) => <button role="tab" aria-selected={index === caseIndex} className={index === caseIndex ? "active" : ""} key={item.id} onClick={() => changeCase(index)}><span>CASO 0{index + 1}</span>{item.title}</button>)}
      </div>

      <div className="uap-case-grid">
        <div className="signal-viewer">
          <div className={`signal-sky ${inspected.length ? "scanning" : ""}`}><i className="signal-object one" /><i className="signal-object two" /><i className="signal-object three" /><div className="sensor-reticle" /><div className="scanner-line" /><span>REC ● &nbsp; SENSOR A-17</span></div>
          <div className="signal-caption"><small>LOCAL DA DETECÇÃO</small><strong>{current.place}</strong><p>{current.signal}</p></div>
        </div>
        <div className="evidence-board">
          <h2>Caderno de evidências</h2>
          <p><strong>Passo 2:</strong> abra cada cartão e pergunte “o que este dado realmente mostra?”.</p>
          <div className="evidence-notes">{current.evidence.map((item, index) => <button className={inspected.includes(index) ? "inspected" : ""} key={item} onClick={() => setInspected((items) => items.includes(index) ? items : [...items, index])}><i>{inspected.includes(index) ? "✓" : index + 1}</i><span><b>{inspected.includes(index) ? "Evidência inspecionada" : "Toque para inspecionar"}</b>{item}</span></button>)}</div>
          <div className={`method-note ${evidenceReady ? "ready" : ""}`}><span>{evidenceReady ? "✓" : "⌕"}</span><p>{evidenceReady ? "Dados reunidos. Agora compare explicações e escolha a que exige menos suposições." : `Ainda faltam ${current.evidence.length - inspected.length} evidência(s). Uma conclusão antes de observar os dados pode virar apenas um palpite.`}</p></div>
          <fieldset>
            <legend>Passos 3 e 4 · Compare e escolha sua conclusão provisória</legend>
            <div className="answer-grid">{possibleAnswers.map((item) => <button type="button" disabled={!evidenceReady} key={item} className={answer === item ? "selected" : ""} onClick={() => setAnswer(item)}>{item === "Nave extraterrestre" ? "✦ " : ""}{item}<small>{item === "Nave extraterrestre" ? "Exige evidência extraordinária" : item === "Dados insuficientes" ? "Conclusão válida quando faltam confirmações" : "Hipótese testável"}</small></button>)}</div>
          </fieldset>
          {answer && (
            <div className={`case-feedback ${correct ? "correct" : "try-again"}`} role="status">
              <strong>{correct ? "Boa investigação!" : answer === "Nave extraterrestre" ? "Essa conclusão vai além dos dados." : "Ainda há uma explicação mais compatível."}</strong>
              <p>{correct ? current.explanation : "Releia as evidências e procure uma hipótese testável com menos suposições."}</p>
            </div>
          )}
          {correct && <button className="primary-button next-case" onClick={() => changeCase((caseIndex + 1) % uapCases.length)}>{caseIndex === uapCases.length - 1 ? "Recomeçar os arquivos" : "Investigar próximo caso"} →</button>}
          <p className="uap-rule"><strong>Regra de ouro:</strong> “não identificado” descreve o estado dos dados. Não é uma identificação como nave extraterrestre.</p>
          {mode === "researcher" && <div className="researcher-rubric"><small>MODO PESQUISADOR · MATRIZ DE CONFIANÇA</small><p><b>Repetibilidade:</b> o sinal apareceu novamente? · <b>Independência:</b> outro sensor confirmou? · <b>Calibração:</b> o instrumento foi testado?</p></div>}
          <SciencePassport evidence="inferred" source="Método científico para análise de observações e qualidade de dados (NASA UAP)" assumptions={["O caso é uma dramatização educativa", "Nenhuma origem extraterrestre foi estabelecida"]} />
        </div>
      </div>
    </section>
  );
}
